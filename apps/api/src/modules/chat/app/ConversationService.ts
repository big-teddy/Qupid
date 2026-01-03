import { supabase } from "../../../config/supabase.js";
import { supabaseAdmin } from "../../../shared/infra/supabase.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ChatSession } from "../domain/ChatSession.js";

export class ConversationService {
    private sessions = new Map<string, ChatSession>();

    async createSession(
        userId: string,
        partnerId: string,
        partnerType: 'persona' | 'coach',
        systemInstruction: string,
    ): Promise<string> {
        const sessionId = this.generateSessionId();

        try {
            // Create conversation in database
            const { data: conversation, error } = await supabase
                .from("conversations")
                .insert({
                    id: sessionId,
                    user_id: userId,
                    partner_type: partnerType,
                    partner_id: partnerId,
                    status: "active",
                    started_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) {
                console.error("Failed to create conversation:", error);
                throw AppError.internal(
                    `Failed to create conversation: ${error.message}`,
                );
            }

            if (!conversation) {
                throw AppError.internal(
                    "Failed to create conversation: No data returned",
                );
            }

            const session = new ChatSession(
                sessionId,
                userId,
                partnerId,
                partnerType,
                systemInstruction,
            );

            this.sessions.set(sessionId, session);
            return sessionId;
        } catch (error) {
            console.error(
                "🚨 Supabase connection failed, using fallback session creation:",
                error,
            );

            // 🚀 Fallback: Supabase 연결 실패 시 메모리 기반 세션 생성
            const fallbackSessionId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const session = new ChatSession(
                fallbackSessionId,
                userId,
                partnerId,
                partnerType,
                systemInstruction,
            );

            this.sessions.set(fallbackSessionId, session);

            return fallbackSessionId;
        }
    }

    async ensureSession(sessionId: string): Promise<ChatSession> {
        const session = this.sessions.get(sessionId);
        if (session) return session;

        const { data: conversation, error } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (error || !conversation) {
            throw AppError.notFound("Chat session");
        }

        let systemInstruction = "당신은 AI 친구입니다.";

        if (conversation.partner_type === 'persona') {
            const { data: persona } = await supabase
                .from("personas")
                .select("system_instruction")
                .eq("id", conversation.partner_id)
                .single();
            if (persona) systemInstruction = persona.system_instruction;
        } else if (conversation.partner_type === 'coach') {
            // Chat 모듈은 Coach 정보를 모르므로 기본값 설정. 실제 프롬프트는 AIService가 주입.
            systemInstruction = "You are a professional relationship coach.";
        }

        const sessionObj = new ChatSession(
            sessionId,
            conversation.user_id,
            conversation.partner_id,
            conversation.partner_type as 'persona' | 'coach',
            systemInstruction,
        );

        const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", sessionId)
            .order("timestamp", { ascending: true });

        if (messages) {
            messages.forEach((msg) => {
                sessionObj.addMessage({
                    sender: msg.sender_type as "user" | "ai",
                    text: msg.content,
                    timestamp: new Date(msg.timestamp).getTime(),
                });
            });
        }

        this.sessions.set(sessionId, sessionObj);
        return sessionObj;
    }

    getSession(sessionId: string): ChatSession | undefined {
        return this.sessions.get(sessionId);
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // End a chat session
    async endSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            // 세션 종료 처리
            this.sessions.delete(sessionId);
        }
    }

    // Cleanup old sessions periodically
    cleanupOldSessions(): void {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        for (const [id, session] of this.sessions.entries()) {
            if (session.createdAt < oneHourAgo) {
                this.sessions.delete(id);
            }
        }
    }

    /**
     * 사용자의 대화 목록 조회
     */
    async getUserConversationHistory(
        userId: string,
        page: number = 1,
        limit: number = 20,
        filter?: string,
    ) {
        try {
            const offset = (page - 1) * limit;

            let query = supabaseAdmin
                .from("conversations")
                .select(
                    `
          *,
          messages(count),
          conversation_analysis(
            total_score,
            analyzed_at
          ),
          personas(
            name,
            avatar
          ),
          coaches(
            name,
            avatar,
            specialty
          )
        `,
                )
                .eq("user_id", userId)
                .order("started_at", { ascending: false })
                .range(offset, offset + limit - 1);

            // 필터 적용
            if (filter === "persona") {
                query = query.eq("partner_type", "persona");
            } else if (filter === "coach") {
                query = query.eq("partner_type", "coach");
            } else if (filter === "analyzed") {
                query = query.not("conversation_analysis", "is", null);
            }

            const { data: conversations, error } = (await query) as any;

            if (error) throw error;

            // 데이터 포맷팅
            const formattedHistory =
                conversations?.map((conv: any) => ({
                    id: conv.id,
                    startedAt: conv.started_at,
                    endedAt: conv.ended_at,
                    status: conv.status,
                    messageCount: conv.messages?.[0]?.count || 0,
                    score: conv.conversation_analysis?.[0]?.total_score || null,
                    partner: {
                        type: conv.partner_type,
                        id: conv.partner_id,
                        name:
                            conv.partner_type === "persona"
                                ? conv.personas?.name
                                : conv.coaches?.name,
                        avatar:
                            conv.partner_type === "persona"
                                ? conv.personas?.avatar
                                : conv.coaches?.avatar,
                        specialty: conv.coaches?.specialty,
                    },
                    duration: conv.ended_at
                        ? Math.round(
                            (new Date(conv.ended_at).getTime() -
                                new Date(conv.started_at).getTime()) /
                            60000,
                        )
                        : null,
                })) || [];

            // 전체 개수 조회
            const { count } = await supabaseAdmin
                .from("conversations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId);

            return {
                conversations: formattedHistory,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            };
        } catch (error) {
            console.error("Error fetching conversation history:", error);
            throw AppError.internal("대화 히스토리를 가져오는데 실패했습니다");
        }
    }

    /**
     * 특정 대화 상세 조회
     */
    async getConversationDetail(userId: string, conversationId: string) {
        try {
            // 대화 정보 조회
            const { data: conversation, error: convError } = await (
                supabaseAdmin as any
            )
                .from("conversations")
                .select(
                    `
          *,
          messages(
            id,
            sender_type,
            content,
            timestamp
          ),
          conversation_analysis(
            *
          ),
          personas(
            name,
            avatar,
            personality
          ),
          coaches(
            name,
            avatar,
            specialty
          )
        `,
                )
                .eq("id", conversationId)
                .eq("user_id", userId)
                .single();

            if (convError) throw convError;
            if (!conversation) throw AppError.notFound("대화를 찾을 수 없습니다");

            // 메시지 정렬
            const messages =
                conversation.messages
                    ?.sort(
                        (a: any, b: any) =>
                            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                    )
                    .map((msg: any) => ({
                        id: msg.id,
                        sender: msg.sender_type,
                        text: msg.content,
                        timestamp: msg.timestamp,
                    })) || [];

            return {
                id: conversation.id,
                startedAt: conversation.started_at,
                endedAt: conversation.ended_at,
                status: conversation.status,
                partner: {
                    type: conversation.partner_type,
                    id: conversation.partner_id,
                    name:
                        conversation.partner_type === "persona"
                            ? conversation.personas?.name
                            : conversation.coaches?.name,
                    avatar:
                        conversation.partner_type === "persona"
                            ? conversation.personas?.avatar
                            : conversation.coaches?.avatar,
                    specialty: conversation.coaches?.specialty,
                },
                messages,
                analysis: conversation.conversation_analysis?.[0] || null,
                duration: conversation.ended_at
                    ? Math.round(
                        (new Date(conversation.ended_at).getTime() -
                            new Date(conversation.started_at).getTime()) /
                        60000,
                    )
                    : null,
            };
        } catch (error) {
            console.error("Error fetching conversation detail:", error);
            if (error instanceof AppError) throw error;
            throw AppError.internal("대화 상세를 가져오는데 실패했습니다");
        }
    }

    /**
     * 사용자의 대화 통계 조회
     */
    async getConversationStats(userId: string) {
        try {
            // 전체 대화 수
            const { count: totalConversations } = await supabaseAdmin
                .from("conversations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId);

            // 오늘 대화 수
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count: todayConversations } = await supabaseAdmin
                .from("conversations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .gte("started_at", today.toISOString());

            // 이번 주 대화 수
            const weekStart = new Date();
            const dayOfWeek = weekStart.getDay();
            const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            weekStart.setDate(diff);
            weekStart.setHours(0, 0, 0, 0);

            const { count: weekConversations } = await supabaseAdmin
                .from("conversations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .gte("started_at", weekStart.toISOString());

            // 평균 점수
            const { data: analysisData } = await (supabaseAdmin as any)
                .from("conversation_analysis")
                .select("total_score")
                .eq("user_id", userId);

            const averageScore =
                analysisData && analysisData.length > 0
                    ? Math.round(
                        analysisData.reduce(
                            (sum: number, a: any) => sum + (a.total_score || 0),
                            0,
                        ) / analysisData.length,
                    )
                    : 0;

            // 가장 많이 대화한 파트너 타입
            const { data: partnerTypes } = await (supabaseAdmin as any)
                .from("conversations")
                .select("partner_type")
                .eq("user_id", userId);

            const typeCounts: Record<string, number> = {};
            partnerTypes?.forEach((conv: any) => {
                typeCounts[conv.partner_type] =
                    (typeCounts[conv.partner_type] || 0) + 1;
            });

            const mostFrequentType = Object.entries(typeCounts).sort(
                ([, a], [, b]) => b - a,
            )[0];

            // 최근 활동 시간
            const { data: recentConv } = await (supabaseAdmin as any)
                .from("conversations")
                .select("started_at")
                .eq("user_id", userId)
                .order("started_at", { ascending: false })
                .limit(1)
                .single();

            return {
                totalConversations: totalConversations || 0,
                todayConversations: todayConversations || 0,
                weekConversations: weekConversations || 0,
                averageScore,
                mostFrequentPartner: mostFrequentType
                    ? {
                        type: mostFrequentType[0],
                        count: mostFrequentType[1],
                        percentage: Math.round(
                            (mostFrequentType[1] / (totalConversations || 1)) * 100,
                        ),
                    }
                    : null,
                lastActiveAt: recentConv?.started_at || null,
                streak: await this.calculateStreak(userId),
            };
        } catch (error) {
            console.error("Error fetching conversation stats:", error);
            throw AppError.internal("대화 통계를 가져오는데 실패했습니다");
        }
    }

    /**
     * 연속 대화 일수 계산
     */
    public async calculateStreak(userId: string): Promise<number> {
        try {
            const { data: conversations } = await (supabaseAdmin as any)
                .from("conversations")
                .select("started_at")
                .eq("user_id", userId)
                .order("started_at", { ascending: false })
                .limit(30);

            if (!conversations || conversations.length === 0) return 0;

            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 30; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                checkDate.setHours(0, 0, 0, 0);

                const nextDate = new Date(checkDate);
                nextDate.setDate(nextDate.getDate() + 1);

                const hasConversation = conversations.some((conv: any) => {
                    const convDate = new Date(conv.started_at);
                    return convDate >= checkDate && convDate < nextDate;
                });

                if (hasConversation) {
                    streak++;
                } else if (i > 0) {
                    // 첫날이 아니고 대화가 없으면 스트릭 종료
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error("Error calculating streak:", error);
            return 0;
        }
    }
}
