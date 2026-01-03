/**
 * MemoryManager - MemGPT 스타일 3단계 메모리 시스템
 * 
 * 1. 단기 기억: 현재 세션 메시지 (메모리 내)
 * 2. 중기 기억: 대화 요약 (conversation_summaries)
 * 3. 장기 기억: 사용자 정보 (user_memories with pgvector)
 */

import { openai } from "../../../shared/infra/openai.js";
import { supabaseAdmin } from "../../../shared/infra/supabase.js";
import type { Message } from "@qupid/core";

// =====================================================
// Types
// =====================================================

export interface UserMemory {
    id: string;
    userId: string;
    memoryType: 'user_fact' | 'preference' | 'conversation_topic' | 'emotional_moment' | 'relationship_event';
    content: string;
    importance: number;
    confidence: number;
    recalledCount: number;
}

export interface ConversationSummary {
    id: string;
    conversationId: string;
    summary: string;
    mainTopics: string[];
    userEmotions: string[];
    keyMoments: string[];
    discoveredFacts: string[];
    relationshipScore: number;
}

export interface MemorySearchResult {
    id: string;
    memoryType: string;
    content: string;
    importance: number;
    similarity: number;
}

export interface RelevantMemories {
    userFacts: MemorySearchResult[];
    recentSummaries: ConversationSummary[];
    contextString: string;
}

// =====================================================
// Embedding Generation
// =====================================================

const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * OpenAI 임베딩 생성
 */
async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Failed to generate embedding:", error);
        throw error;
    }
}

// =====================================================
// Memory Manager Class
// =====================================================

export class MemoryManager {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    // =====================================================
    // 1. 기억 저장
    // =====================================================

    /**
     * 사용자 기억 저장
     */
    async saveMemory(
        content: string,
        memoryType: UserMemory['memoryType'],
        options?: {
            importance?: number;
            confidence?: number;
            sourceConversationId?: string;
        }
    ): Promise<string | null> {
        try {
            // 임베딩 생성
            const embedding = await generateEmbedding(content);

            // DB에 저장 (NOTE: 타입 생성 전에는 any로 처리)
            const { data, error } = await (supabaseAdmin
                .from('user_memories') as any)
                .insert({
                    user_id: this.userId,
                    memory_type: memoryType,
                    content,
                    embedding,
                    importance: options?.importance || 0.5,
                    confidence: options?.confidence || 0.8,
                    source_conversation_id: options?.sourceConversationId,
                })
                .select('id')
                .single();

            if (error) {
                console.error("Failed to save memory:", error);
                return null;
            }

            return data?.id || null;
        } catch (error) {
            console.error("Error saving memory:", error);
            return null;
        }
    }

    /**
     * 대화 요약 저장
     */
    async saveSummary(
        conversationId: string,
        summary: {
            text: string;
            mainTopics: string[];
            userEmotions: string[];
            keyMoments: string[];
            discoveredFacts: string[];
            relationshipScore: number;
            messageRange: { start: number; end: number };
        }
    ): Promise<string | null> {
        try {
            // 임베딩 생성
            const embedding = await generateEmbedding(summary.text);

            // DB에 저장 (NOTE: 타입 생성 전에는 any로 처리)
            const { data, error } = await (supabaseAdmin
                .from('conversation_summaries') as any)
                .insert({
                    conversation_id: conversationId,
                    user_id: this.userId,
                    summary: summary.text,
                    embedding,
                    main_topics: summary.mainTopics,
                    user_emotions: summary.userEmotions,
                    key_moments: summary.keyMoments,
                    discovered_facts: summary.discoveredFacts,
                    relationship_score: summary.relationshipScore,
                    message_start_index: summary.messageRange.start,
                    message_end_index: summary.messageRange.end,
                })
                .select('id')
                .single();

            if (error) {
                console.error("Failed to save summary:", error);
                return null;
            }

            // 발견된 사실들을 장기 기억에도 저장
            for (const fact of summary.discoveredFacts) {
                await this.saveMemory(fact, 'user_fact', {
                    sourceConversationId: conversationId,
                });
            }

            return data?.id || null;
        } catch (error) {
            console.error("Error saving summary:", error);
            return null;
        }
    }

    // =====================================================
    // 2. 기억 검색
    // =====================================================

    /**
     * 현재 대화 맥락과 관련된 기억 검색
     */
    async retrieveRelevantMemories(
        currentContext: string,
        options?: {
            memoryLimit?: number;
            summaryLimit?: number;
            memoryTypes?: UserMemory['memoryType'][];
        }
    ): Promise<RelevantMemories> {
        const memoryLimit = options?.memoryLimit || 5;
        const summaryLimit = options?.summaryLimit || 3;

        try {
            // 현재 맥락의 임베딩 생성
            const contextEmbedding = await generateEmbedding(currentContext);

            // 유사한 기억 검색 (NOTE: 타입 생성 전에는 any로 처리)
            const { data: memories, error: memError } = await (supabaseAdmin as any).rpc(
                'search_user_memories',
                {
                    p_user_id: this.userId,
                    p_embedding: contextEmbedding,
                    p_limit: memoryLimit,
                    p_memory_types: options?.memoryTypes || null,
                }
            );

            if (memError) {
                console.error("Failed to search memories:", memError);
            }

            // 유사한 대화 요약 검색 (NOTE: 타입 생성 전에는 any로 처리)
            const { data: summaries, error: sumError } = await (supabaseAdmin as any).rpc(
                'search_conversation_summaries',
                {
                    p_user_id: this.userId,
                    p_embedding: contextEmbedding,
                    p_limit: summaryLimit,
                }
            );

            if (sumError) {
                console.error("Failed to search summaries:", sumError);
            }

            // 결과 포맷팅
            const userFacts: MemorySearchResult[] = (memories || []).map((m: any) => ({
                id: m.id,
                memoryType: m.memory_type,
                content: m.content,
                importance: m.importance,
                similarity: m.similarity,
            }));

            const recentSummaries: ConversationSummary[] = (summaries || []).map((s: any) => ({
                id: s.id,
                conversationId: s.conversation_id,
                summary: s.summary,
                mainTopics: s.main_topics || [],
                userEmotions: [],
                keyMoments: [],
                discoveredFacts: [],
                relationshipScore: 0,
            }));

            // 프롬프트에 포함할 컨텍스트 문자열 생성
            const contextString = this.buildMemoryContextString(userFacts, recentSummaries);

            // 기억 회상 카운트 업데이트
            for (const memory of userFacts) {
                await this.markMemoryRecalled(memory.id);
            }

            return { userFacts, recentSummaries, contextString };
        } catch (error) {
            console.error("Error retrieving memories:", error);
            return { userFacts: [], recentSummaries: [], contextString: '' };
        }
    }

    /**
     * 최근 저장된 기억 조회 (비 벡터 기반)
     */
    async getRecentMemories(limit: number = 10): Promise<UserMemory[]> {
        const { data, error } = await (supabaseAdmin
            .from('user_memories') as any)
            .select('*')
            .eq('user_id', this.userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Failed to get recent memories:", error);
            return [];
        }

        return data.map((m: any) => ({
            id: m.id,
            userId: m.user_id,
            memoryType: m.memory_type,
            content: m.content,
            importance: m.importance,
            confidence: m.confidence,
            recalledCount: m.recalled_count,
        }));
    }

    // =====================================================
    // 3. 대화에서 기억 추출
    // =====================================================

    /**
     * 대화에서 사용자 정보 자동 추출
     */
    async extractMemoriesFromConversation(
        messages: Message[],
        conversationId?: string
    ): Promise<{ facts: string[]; preferences: string[] }> {
        const userMessages = messages.filter(m => m.sender === 'user');

        if (userMessages.length < 3) {
            return { facts: [], preferences: [] };
        }

        const conversationText = userMessages
            .map(m => m.text)
            .join('\n');

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `사용자의 대화에서 기억할 만한 정보를 추출하세요.

JSON 형식으로 응답:
{
  "facts": ["알게 된 사실1", "알게 된 사실2"],
  "preferences": ["선호도1", "선호도2"]
}

추출 기준:
- facts: 취미, 직업, 관심사, 가족, 반려동물, 생활習慣 등
- preferences: 대화 스타일 선호, 좋아하는 것, 싫어하는 것

주의:
- 간단하고 명확하게 (10-30자)
- 추측하지 말고 확실한 것만
- 빈 배열이어도 됨`
                    },
                    {
                        role: 'user',
                        content: `대화 내용:\n${conversationText}`
                    }
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(response.choices[0]?.message?.content || '{}');
            const facts = result.facts || [];
            const preferences = result.preferences || [];

            // 추출된 정보를 기억에 저장
            for (const fact of facts) {
                await this.saveMemory(fact, 'user_fact', {
                    importance: 0.7,
                    sourceConversationId: conversationId,
                });
            }

            for (const pref of preferences) {
                await this.saveMemory(pref, 'preference', {
                    importance: 0.6,
                    sourceConversationId: conversationId,
                });
            }

            return { facts, preferences };
        } catch (error) {
            console.error("Failed to extract memories:", error);
            return { facts: [], preferences: [] };
        }
    }

    /**
     * 대화 요약 생성
     */
    async generateConversationSummary(
        messages: Message[],
        conversationId: string
    ): Promise<ConversationSummary | null> {
        if (messages.length < 6) {
            return null;
        }

        const conversationText = messages
            .map(m => `${m.sender === 'user' ? '사용자' : 'AI'}: ${m.text}`)
            .join('\n');

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `대화를 분석하고 요약하세요.

JSON 형식으로 응답:
{
  "summary": "2-3문장 대화 요약",
  "mainTopics": ["주제1", "주제2"],
  "userEmotions": ["감정1", "감정2"],
  "keyMoments": ["중요 순간 설명"],
  "discoveredFacts": ["알게 된 사실"],
  "relationshipScore": 0-100
}`
                    },
                    {
                        role: 'user',
                        content: conversationText
                    }
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            });

            const result = JSON.parse(response.choices[0]?.message?.content || '{}');

            // 요약 저장
            const summaryId = await this.saveSummary(conversationId, {
                text: result.summary || '',
                mainTopics: result.mainTopics || [],
                userEmotions: result.userEmotions || [],
                keyMoments: result.keyMoments || [],
                discoveredFacts: result.discoveredFacts || [],
                relationshipScore: result.relationshipScore || 50,
                messageRange: { start: 0, end: messages.length },
            });

            if (!summaryId) return null;

            return {
                id: summaryId,
                conversationId,
                summary: result.summary,
                mainTopics: result.mainTopics || [],
                userEmotions: result.userEmotions || [],
                keyMoments: result.keyMoments || [],
                discoveredFacts: result.discoveredFacts || [],
                relationshipScore: result.relationshipScore || 50,
            };
        } catch (error) {
            console.error("Failed to generate summary:", error);
            return null;
        }
    }

    // =====================================================
    // Private Helpers
    // =====================================================

    public buildMemoryContextString(
        facts: MemorySearchResult[],
        summaries: ConversationSummary[]
    ): string {
        let context = '';

        if (facts.length > 0) {
            context += '## 🧠 이 사람에 대해 알고 있는 것\n';
            facts.forEach(f => {
                context += `- ${f.content}\n`;
            });
            context += '\n';
        }

        if (summaries.length > 0) {
            context += '## 📝 이전 대화 기억\n';
            summaries.forEach(s => {
                context += `- ${s.summary}\n`;
                if (s.mainTopics.length > 0) {
                    context += `  (주제: ${s.mainTopics.join(', ')})\n`;
                }
            });
        }

        return context;
    }

    private async markMemoryRecalled(memoryId: string): Promise<void> {
        await (supabaseAdmin as any).rpc('recall_memory', { p_memory_id: memoryId });
    }
}

// =====================================================
// Factory Function
// =====================================================

export function createMemoryManager(userId: string): MemoryManager {
    return new MemoryManager(userId);
}

export default MemoryManager;
