import { openai, defaultModel } from "../../../shared/infra/openai.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { Message, ConversationAnalysis, RealtimeFeedback } from "@qupid/core";
import { supabase } from "../../../config/supabase.js";

export class AnalysisService {
    async analyzeConversation(
        messages: Message[],
    ): Promise<ConversationAnalysis> {
        const conversationText = messages
            .map((msg) => `${msg.sender === "user" ? "나" : "상대"}: ${msg.text}`)
            .join("\n");

        const prompt = `
    다음은 사용자와 AI 페르소나 간의 소개팅 대화입니다. 사용자의 대화 스킬을 '친근함', '호기심(질문)', '공감' 세 가지 기준으로 분석하고, 종합 점수와 함께 구체적인 피드백을 JSON 형식으로 제공해주세요. 결과는 친절하고 격려하는 톤으로 작성해주세요.

    --- 대화 내용 ---
    ${conversationText}
    --- 분석 시작 ---
    
    다음 JSON 형식으로 정확히 응답해주세요:
    {
      "totalScore": 대화 전체에 대한 100점 만점의 종합 점수 (정수),
      "feedback": "대화 전체에 대한 한 줄 요약 피드백",
      "friendliness": {
        "score": 친근함 항목 점수 (1-100, 정수),
        "feedback": "친근함에 대한 구체적인 피드백"
      },
      "curiosity": {
        "score": 호기심(질문) 항목 점수 (1-100, 정수),
        "feedback": "호기심(질문)에 대한 구체적인 피드백"
      },
      "empathy": {
        "score": 공감 능력 항목 점수 (1-100, 정수),
        "feedback": "공감 능력에 대한 구체적인 피드백"
      },
      "positivePoints": ["대화에서 잘한 점 1", "대화에서 잘한 점 2"],
      "pointsToImprove": [
        {
          "topic": "개선할 점의 주제",
          "suggestion": "구체적인 개선 방안"
        }
      ]
    }
    `;

        try {
            const response = await openai.chat.completions.create({
                model: defaultModel,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert dating coach analyzing conversation skills. Always respond in valid JSON format.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                response_format: { type: "json_object" },
            });

            const jsonText = response.choices[0]?.message?.content || "{}";
            return JSON.parse(jsonText) as ConversationAnalysis;
        } catch (error) {
            throw AppError.internal("Failed to analyze conversation", error);
        }
    }

    async getRealtimeFeedback(
        lastUserMessage: string,
        lastAiMessage?: string,
    ): Promise<RealtimeFeedback | null> {
        // Only provide feedback occasionally
        if (Math.random() > 0.4) {
            return null;
        }

        const prompt = `
    A user is in a dating conversation. Analyze their last message.
    AI's last message: "${lastAiMessage || "대화 시작"}"
    User's message: "${lastUserMessage}"
    
    Return JSON:
    {
      "isGood": true/false,
      "message": "Korean feedback max 15 chars"
    }
    `;

        try {
            const response = await openai.chat.completions.create({
                model: defaultModel,
                messages: [
                    {
                        role: "system",
                        content: "Provide quick dating conversation feedback in Korean.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 100,
                response_format: { type: "json_object" },
            });

            const jsonText = response.choices[0]?.message?.content || "{}";
            return JSON.parse(jsonText) as RealtimeFeedback;
        } catch {
            return null; // Fail silently
        }
    }

    async getCoachSuggestion(
        messages: Message[],
        persona?: any,
    ): Promise<{ reason: string; suggestion: string }> {
        const conversationText = messages
            .filter((msg) => msg.sender !== "system")
            .map((msg) => `${msg.sender === "user" ? "나" : "상대"}: ${msg.text}`)
            .join("\n");

        // 페르소나 정보를 활용한 맞춤형 프롬프트 생성
        const personaInfo = persona
            ? `
    상대방 페르소나 정보:
    - 이름: ${persona.name}
    - 나이: ${persona.age}세
    - 직업: ${persona.job}
    - 성격: ${persona.mbti}
    - 관심사: ${persona.tags?.join(", ") || "일반적인 관심사"}
    - 소개: ${persona.intro || ""}
    - 대화 스타일: ${persona.conversationStyle || ""}
    `
            : "";

        const prompt = `
    사용자가 대화를 이어가는데 도움이 필요합니다.
    ${personaInfo}
    
    대화:
    ${conversationText}
    
    위 페르소나 정보를 바탕으로 상대방의 성격, 관심사, 대화 스타일에 맞는 구체적인 메시지를 제안해주세요.
    
    JSON 응답:
    {
      "reason": "왜 이 제안이 좋은지 (페르소나 특성을 고려한 이유)",
      "suggestion": "상대방의 관심사와 성격에 맞는 구체적인 메시지 제안"
    }
    `;

        try {
            const response = await openai.chat.completions.create({
                model: defaultModel,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a dating coach. Respond in Korean with JSON format.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.8,
                response_format: { type: "json_object" },
            });

            const jsonText = response.choices[0]?.message?.content || "{}";
            return JSON.parse(jsonText);
        } catch (error) {
            throw AppError.internal("Failed to get coach suggestion", error);
        }
    }

    // Save conversation analysis to database
    async saveConversationAnalysis(
        conversationId: string,
        analysis: ConversationAnalysis,
    ): Promise<void> {
        const { error } = await supabase.from("conversation_analysis").insert({
            conversation_id: conversationId,
            total_score: analysis.totalScore,
            friendliness_score: analysis.friendliness.score,
            curiosity_score: analysis.curiosity.score,
            empathy_score: analysis.empathy.score,
            feedback: analysis.feedback,
            analyzed_at: new Date().toISOString(),
        });

        if (error) {
            console.error("Failed to save analysis:", error);
        }
    }

    // Get conversation analysis from database
    async getConversationAnalysis(conversationId: string): Promise<any> {
        const { data, error } = await supabase
            .from("conversation_analysis")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("analyzed_at", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error("Failed to get analysis:", error);
            return null;
        }

        return data;
    }

    /**
     * 대화 스타일 분석 및 추천
     */
    async analyzeConversationStyle(messages: Message[]): Promise<{
        currentStyle: {
            type: string;
            characteristics: string[];
            strengths: string[];
            weaknesses: string[];
        };
        recommendations: {
            category: string;
            tips: string[];
            examples: string[];
        }[];
    }> {
        if (messages.length < 3) {
            return {
                currentStyle: {
                    type: "분석 중",
                    characteristics: ["대화가 더 필요해요"],
                    strengths: [],
                    weaknesses: [],
                },
                recommendations: [],
            };
        }

        const userMessages = messages.filter((m) => m.sender === "user");
        const conversationText = userMessages.map((m) => m.text).join("\n");

        const prompt = `다음 연애 대화를 분석하고 스타일과 개선 추천을 제공해주세요:

${conversationText}

다음 JSON 형식으로 응답해주세요:
{
  "currentStyle": {
    "type": "대화 스타일 유형 (예: 친근한, 수줍은, 적극적인, 유머러스한)",
    "characteristics": ["특징1", "특징2", "특징3"],
    "strengths": ["강점1", "강점2"],
    "weaknesses": ["약점1", "약점2"]
  },
  "recommendations": [
    {
      "category": "카테고리명 (예: 질문하기, 감정표현, 유머)",
      "tips": ["구체적인 팁1", "구체적인 팁2"],
      "examples": ["예시 문장1", "예시 문장2"]
    }
  ]
}`;

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a dating conversation style analyzer. Provide helpful and encouraging feedback. Respond only with valid JSON.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                response_format: { type: "json_object" },
            });

            const result = JSON.parse(completion.choices[0].message.content || "{}");

            return {
                currentStyle: result.currentStyle || {
                    type: "친근한",
                    characteristics: ["따뜻한 대화", "적극적인 반응"],
                    strengths: ["공감 능력", "대화 이어가기"],
                    weaknesses: ["질문 부족"],
                },
                recommendations: result.recommendations || [
                    {
                        category: "질문하기",
                        tips: [
                            "상대방의 관심사에 대해 구체적으로 물어보세요",
                            "열린 질문을 활용하세요",
                        ],
                        examples: [
                            "어떤 영화 장르를 좋아하세요?",
                            "주말에는 보통 뭐 하면서 시간을 보내세요?",
                        ],
                    },
                ],
            };
        } catch (error) {
            console.error("Style analysis error:", error);
            return {
                currentStyle: {
                    type: "분석 중",
                    characteristics: ["대화 스타일 분석 중입니다"],
                    strengths: [],
                    weaknesses: [],
                },
                recommendations: [],
            };
        }
    }
}
