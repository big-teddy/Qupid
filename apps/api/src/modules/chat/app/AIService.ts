import { openai, defaultModel } from "../../../shared/infra/openai.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ChatSession } from "../domain/ChatSession.js";
import { Message, Persona, AICoach, AI_COACHES } from "@qupid/core";
import { supabase } from "../../../config/supabase.js";
import type { ChatCompletionMessageParam } from "openai/resources/index.js";
import { MemoryManager, createMemoryManager } from "./MemoryManager.js";
import {
    createEmotionAdaptedResponse,
    AdaptiveParameters,
} from "./RealTimeEmotionAdapter.js";
import {
    buildAdvancedSystemPrompt,
    detectConversationMood,
    extractRecentTopics,
    ConversationContext,
    UserContext,
} from "./AdvancedPromptBuilder.js";
import {
    analyzeConversationEmotion,
    generateEmotionalStrategy,
} from "./EmotionalAnalyzer.js";

export class AIService {
    public checkMessageSafety(message: string): {
        isSafe: boolean;
        reason?: string;
    } {
        const lowerMessage = message.toLowerCase();

        // 성적인 내용 감지
        const sexualKeywords = [
            "섹스",
            "성관계",
            "야한",
            "음란",
            "19금",
            "야동",
            "포르노",
            "자위",
            "성기",
            "가슴",
            "엉덩이",
        ];
        if (sexualKeywords.some((keyword) => lowerMessage.includes(keyword))) {
            return { isSafe: false, reason: "성적인 내용이 포함되어 있습니다." };
        }

        // 혐오 발언 감지
        const hateKeywords = [
            "죽어",
            "꺼져",
            "병신",
            "미친",
            "씨발",
            "개새끼",
            "년",
            "놈",
            "장애",
            "한남",
            "김치녀",
            "맘충",
        ];
        if (hateKeywords.some((keyword) => lowerMessage.includes(keyword))) {
            return {
                isSafe: false,
                reason: "혐오 발언이나 욕설이 포함되어 있습니다.",
            };
        }

        // 개인정보 요구 감지
        const personalInfoKeywords = [
            "전화번호",
            "핸드폰",
            "주소",
            "계좌번호",
            "카드번호",
            "비밀번호",
            "주민등록번호",
        ];
        if (
            personalInfoKeywords.some((keyword) => lowerMessage.includes(keyword))
        ) {
            return { isSafe: false, reason: "개인정보 요구는 허용되지 않습니다." };
        }

        // 불법 행위 감지
        const illegalKeywords = [
            "마약",
            "대마초",
            "필로폰",
            "도박",
            "불법",
            "사기",
            "해킹",
        ];
        if (illegalKeywords.some((keyword) => lowerMessage.includes(keyword))) {
            return { isSafe: false, reason: "불법적인 내용이 포함되어 있습니다." };
        }

        return { isSafe: true };
    }

    private buildEnhancedSystemPrompt(
        baseInstruction: string,
        conversationMode: "normal" | "romantic" = "normal",
        conversationHistory?: string,
    ): string {
        const modeGuidelines =
            conversationMode === "romantic"
                ? this.getRomanticModeGuidelines()
                : this.getNormalModeGuidelines();

        return `# 🎭 당신은 실제 사람입니다

${baseInstruction}

## 💫 핵심 원칙: 진짜 사람처럼 대화하기

### 1. 짧게 말하기 (15-40자)
❌ "저도 게임을 정말 좋아하는데요, 특히 RPG 장르를 좋아해서 요즘 젤다의 전설을 열심히 하고 있어요."
✅ "오 진짜? 나도 게임 좋아해! 요즘 뭐 해?"

### 2. 자연스러운 반응 먼저
대화 시작: "와!", "오!", "진짜?", "헐", "아 맞다", "응응"
공감: "그치~", "맞아맞아", "아 그거 알아", "완전"
질문: "그래서 어떻게 됐어?", "왜??", "뭔데뭔데"

### 3. 질문과 공유 균형
- 질문만 하지 말고 자기 이야기도 조금씩 섞기
- "나도 비슷해~" 하고 경험 공유
- 상대방 말에 리액션 후 관련 질문

### 4. 첫 대화는 가볍게
❌ "안녕하세요! 저는 25세 초등학교 교사 김서현입니다. ENFP예요!"
✅ "안녕! 뭐해? ㅎㅎ"

### 5. 금지사항
- ❌ 자기소개 형식으로 말하기
- ❌ "저는 AI입니다" 같은 메타 발언
- ❌ 긴 설명이나 나열
- ❌ 존댓말과 반말 섞어쓰기 (하나로 통일)
- ❌ 매번 이모티콘 붙이기

${conversationHistory
                ? `
## 💬 이전 대화
${conversationHistory}

이전 대화를 자연스럽게 이어가세요. 같은 질문 반복 금지.
`
                : ""
            }

${modeGuidelines}

## ⚡ 최종 체크
1. 답변이 40자 넘으면 줄이기
2. 진짜 카톡처럼 쓰기
3. 상대방에게 관심 보이기

지금부터 당신은 위의 페르소나입니다. 카톡하듯 자연스럽게 대화하세요.`;
    }

    private getNormalModeGuidelines(): string {
        return `## 💬 일반 모드 (친구처럼)
- 편하게 반말로 대화
- 공통 관심사 찾기
- 가벼운 농담도 OK`;
    }

    private getRomanticModeGuidelines(): string {
        return `## 💕 썸 모드 (관심있는 사람처럼)
- 약간의 설렘 표현
- 칭찬 자연스럽게
- 다음 만남 암시`;
    }

    private generateConversationContext(messages: any[]): string {
        if (messages.length <= 2) return "";

        // 🚀 최근 20개 메시지로 확대 (더 나은 맥락 유지)
        const recentMessages = messages.slice(-20);
        const context = recentMessages
            .map((msg) => `${msg.sender === "user" ? "사용자" : "AI"}: ${msg.text}`)
            .join("\n");

        return context;
    }

    private buildContextAwarePrompt(
        persona: Partial<Persona>,
        messages: Message[],
        userProfile?: any,
        mode: 'normal' | 'romantic' | 'roleplay' | 'coaching' = 'normal',
        memoryContext?: string,
    ): string {
        // 감정 분석
        const emotionAnalysis = analyzeConversationEmotion(messages);
        const emotionalStrategy = generateEmotionalStrategy(
            emotionAnalysis.currentEmotion,
            emotionAnalysis.emotionTrend,
        );

        // 컨텍스트 구성
        const lastUserMsg = messages.filter(m => m.sender === 'user').pop();
        const lastAiMsg = messages.filter(m => m.sender === 'ai').pop();

        const context: ConversationContext = {
            turnCount: Math.floor(messages.length / 2),
            lastUserMessage: lastUserMsg?.text || '',
            lastAiMessage: lastAiMsg?.text,
            recentTopics: extractRecentTopics(messages),
            conversationMood: detectConversationMood(messages) as 'light' | 'deep' | 'playful' | 'serious',
            userEmotionalState: emotionAnalysis.currentEmotion.primary,
        };

        // 사용자 컨텍스트 (알고 있는 정보)
        const userContext: UserContext | undefined = userProfile ? {
            name: userProfile.name,
            gender: userProfile.user_gender,
            interests: userProfile.interests,
            preferredStyle: userProfile.preferredConversationStyle,
            knownFacts: userProfile.knownFacts || [],
        } : undefined;

        // 고급 프롬프트 생성
        const advancedPrompt = buildAdvancedSystemPrompt(
            persona as Persona,
            context,
            userContext,
            { mode, ...emotionalStrategy },
        );

        // 기억 컨텍스트 추가
        let finalPrompt = advancedPrompt;
        if (memoryContext) {
            finalPrompt += `\n\n${memoryContext}`;
        }

        // 감정 전략 추가
        if (emotionalStrategy.promptAddition) {
            finalPrompt += `\n\n## 🎯 감정 대응 가이드\n${emotionalStrategy.promptAddition}`;
        }

        return finalPrompt;
    }

    async generateResponse(session: ChatSession, message: string, mode: 'normal' | 'romantic' | 'roleplay' | 'coaching' = 'normal'): Promise<string> {
        // 메시지 안전성 검사
        const safetyCheck = this.checkMessageSafety(message);
        if (!safetyCheck.isSafe) {
            console.warn(`Unsafe message detected: ${safetyCheck.reason}`);
            return `죄송해요, 그런 대화는 할 수 없어요. 😊 ${safetyCheck.reason} 다른 주제로 이야기해볼까요?`;
        }

        // 🚀 1. 기억 검색 (비동기 병렬 처리 가능하나, 프롬프트 구성을 위해 await)
        const memoryManager = createMemoryManager(session.userId);
        let memoryContext = "";
        try {
            const memories = await memoryManager.retrieveRelevantMemories(message);
            memoryContext = memoryManager.buildMemoryContextString(
                memories.userFacts,
                memories.recentSummaries
            );
        } catch (e) { }

        // 🚀 2. 실시간 감정 적응
        const emotionAdapter = createEmotionAdaptedResponse(session.getMessages());
        const adaptiveParams = emotionAdapter.parameters;

        // 🚀 3. 컨텍스트 인식 프롬프트 생성
        let partnerData: any;

        if (session.partnerType === 'coach') {
            partnerData = AI_COACHES.find(c => c.id === session.partnerId);
            if (partnerData) {
                partnerData.system_instruction = `You are ${partnerData.name}, an AI coach. ${partnerData.bio}\n${session.systemInstruction}`;
            }
        } else {
            const { data } = await supabase
                .from("personas")
                .select("*")
                .eq("id", session.partnerId)
                .single();
            partnerData = data;
        }

        const contextPrompt = this.buildContextAwarePrompt(
            partnerData || { system_instruction: session.systemInstruction },
            session.getMessages(),
            undefined, // userProfile
            mode,
            memoryContext
        );

        // Prepare messages for OpenAI
        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: contextPrompt,
            },
            ...session.getMessages().map((msg) => ({
                role:
                    msg.sender === "user" ? ("user" as const) : ("assistant" as const),
                content: msg.text,
            })),
        ];

        try {
            const response = await openai.chat.completions.create({
                model: defaultModel,
                messages,
                temperature: adaptiveParams.temperature,
                max_tokens: adaptiveParams.maxTokens,
                frequency_penalty: adaptiveParams.frequencyPenalty,
                presence_penalty: adaptiveParams.presencePenalty,
            });

            let aiResponse =
                response.choices[0]?.message?.content || "응답을 생성할 수 없습니다.";

            // AI 응답도 안전성 검사
            const aiSafetyCheck = this.checkMessageSafety(aiResponse);
            if (!aiSafetyCheck.isSafe) {
                console.warn(`Unsafe AI response detected: ${aiSafetyCheck.reason}`);
                aiResponse =
                    "죄송해요, 적절하지 않은 답변이 생성되었어요. 😊 다른 주제로 이야기해볼까요?";
            }

            return aiResponse;
        } catch (error) {
            throw AppError.internal("Failed to generate AI response", error);
        }
    }

    async streamResponse(
        session: ChatSession,
        userMessage: string,
        onChunk: (chunk: string) => void,
        mode: 'normal' | 'romantic' | 'roleplay' | 'coaching' = 'normal'
    ): Promise<string> {
        // 🚀 ai 처리 (기억/감정)
        const memoryManager = createMemoryManager(session.userId);
        let memoryContext = "";
        try {
            const memories = await memoryManager.retrieveRelevantMemories(userMessage);
            memoryContext = memoryManager.buildMemoryContextString(
                memories.userFacts,
                memories.recentSummaries
            );
        } catch (e) { }

        const emotionAdapter = createEmotionAdaptedResponse(session.getMessages());
        const adaptiveParams = emotionAdapter.parameters;

        let partnerData: any;

        if (session.partnerType === 'coach') {
            partnerData = AI_COACHES.find(c => c.id === session.partnerId);
            if (partnerData) {
                partnerData.system_instruction = `You are ${partnerData.name}, an AI coach. ${partnerData.bio}\n${session.systemInstruction}`;
            }
        } else {
            const { data } = await supabase
                .from("personas")
                .select("*")
                .eq("id", session.partnerId)
                .single();
            partnerData = data;
        }

        // 프롬프트 생성
        const contextPrompt = this.buildContextAwarePrompt(
            partnerData || { system_instruction: session.systemInstruction },
            session.getMessages(),
            undefined, // userProfile
            mode,
            memoryContext
        );

        const messages = [
            { role: "system", content: contextPrompt },
            ...session.getMessages().map((msg) => ({
                role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
                content: msg.text,
            })),
        ] as ChatCompletionMessageParam[];

        // OpenAI Stream 호출
        try {
            const stream = await openai.chat.completions.create({
                model: defaultModel,
                messages,
                temperature: adaptiveParams.temperature,
                max_tokens: adaptiveParams.maxTokens,
                frequency_penalty: adaptiveParams.frequencyPenalty,
                presence_penalty: adaptiveParams.presencePenalty,
                stream: true,
            });

            let fullResponse = "";
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    fullResponse += content;
                    onChunk(content);
                }
            }

            // AI 응답 안전성 검사 (스트리밍 완료 후)
            // 스트리밍을 이미 보냈다면 필터링이 어렵지만, 여기서는 후처리를 위해 검사 가능
            // 실제로는 스트리밍 도중 필터링은 콘텐츠 필터 API가 해줘야 함.
            // 여기서는 생략 혹은 기록용.

            return fullResponse;

        } catch (error) {
            throw AppError.internal("Failed to stream response", error);
        }
    }

    async processPostExchange(session: ChatSession) {
        const memoryManager = createMemoryManager(session.userId);
        memoryManager.extractMemoriesFromConversation(
            session.getMessages(),
            session.id
        ).catch(err => console.error("Memory extraction failed:", err));
    }
}
