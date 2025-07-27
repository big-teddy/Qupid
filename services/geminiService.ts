
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { Message, ConversationAnalysis, RealtimeFeedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chatModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';

export const createChatSession = (systemInstruction: string): Chat => {
  return ai.chats.create({
    model: chatModel,
    config: {
      systemInstruction: `${systemInstruction} Keep your responses concise, natural, and engaging, like a real chat conversation.`,
    },
  });
};

export const sendMessageToAI = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "죄송해요, 지금은 답변하기 어렵네요. 잠시 후 다시 시도해주세요.";
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    totalScore: { type: Type.INTEGER, description: '대화 전체에 대한 100점 만점의 종합 점수' },
    feedback: { type: Type.STRING, description: '대화 전체에 대한 한 줄 요약 피드백' },
    friendliness: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: '친근함 항목 점수 (1-100)' },
        feedback: { type: Type.STRING, description: '친근함에 대한 구체적인 피드백' },
      },
    },
    curiosity: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: '호기심(질문) 항목 점수 (1-100)' },
            feedback: { type: Type.STRING, description: '호기심(질문)에 대한 구체적인 피드백' },
        },
    },
    empathy: {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: '공감 능력 항목 점수 (1-100)' },
            feedback: { type: Type.STRING, description: '공감 능력에 대한 구체적인 피드백' },
        },
    },
    positivePoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '대화에서 잘한 점 2~3가지',
    },
    pointsToImprove: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: '개선할 점의 주제 (예: 질문 방식)' },
          suggestion: { type: Type.STRING, description: '구체적인 개선 방안 및 예시' },
        },
      },
      description: '개선할 점 1~2가지와 구체적인 제안',
    },
  },
};


export const analyzeConversation = async (conversation: Message[]): Promise<ConversationAnalysis | null> => {
    const conversationText = conversation.map(msg => `${msg.sender === 'user' ? '나' : '상대'}: ${msg.text}`).join('\n');
    const prompt = `
    다음은 사용자와 AI 페르소나 간의 소개팅 대화입니다. 사용자의 대화 스킬을 '친근함', '호기심(질문)', '공감' 세 가지 기준으로 분석하고, 종합 점수와 함께 구체적인 피드백을 JSON 형식으로 제공해주세요. 결과는 친절하고 격려하는 톤으로 작성해주세요.

    --- 대화 내용 ---
    ${conversationText}
    --- 분석 시작 ---
    `;
  
    try {
        const response = await ai.models.generateContent({
            model: chatModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const analysisResult = JSON.parse(jsonText);
        return analysisResult as ConversationAnalysis;

    } catch (error) {
        console.error("Error analyzing conversation:", error);
        return null;
    }
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        isGood: { type: Type.BOOLEAN, description: '사용자의 말이 긍정적인가?' },
        message: { type: Type.STRING, description: '10자 이내의 짧은 격려 또는 팁' },
    },
};

export const getRealtimeFeedback = async (lastUserMessage: string, lastAiMessage: string | undefined): Promise<RealtimeFeedback | null> => {
    const prompt = `
    A user is in a dating conversation. Here is their last message and the AI's response to it.
    AI's last message: "${lastAiMessage || '대화 시작'}"
    User's message: "${lastUserMessage}"
    
    Analyze the user's message in context. Is it a good message (e.g., good question, good reaction, showing interest)? 
    Provide a very short, encouraging feedback or a tip in Korean (max 15 characters).
    Return the analysis in JSON format.
    Example of good feedback: "좋은 질문이에요! 👍", "공감가는 말이네요! 😊"
    Example of a tip: "다른 주제로 넘어가볼까요? 💡", "질문으로 답해보세요! 🤔"
    `;

    // Only provide feedback occasionally to avoid annoyance
    if (Math.random() > 0.4) {
        return null;
    }

    try {
        const response = await ai.models.generateContent({
            model: chatModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
                thinkingConfig: { thinkingBudget: 0 } // For low latency
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RealtimeFeedback;
    } catch (error) {
        // Fail silently to not interrupt the chat flow
        console.error("Realtime feedback error:", error);
        return null;
    }
};


export const getStylingAdvice = async (prompt: string): Promise<{ text: string, imageUrl: string | null }> => {
  try {
    const textResponse = await ai.models.generateContent({
      model: chatModel,
      contents: `You are a professional fashion stylist. Provide styling advice for the following request. Be specific, encouraging, and easy to understand. Request: "${prompt}"`,
    });
    const adviceText = textResponse.text;

    const imageResponse = await ai.models.generateImages({
      model: imageModel,
      prompt: `Fashion photography of a full-body outfit for: ${prompt}. Clean, bright, modern style. Show a person wearing the clothes.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    });
    
    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { text: adviceText, imageUrl };

  } catch (error) {
    console.error("Error getting styling advice:", error);
    return { text: "스타일링 추천 중 오류가 발생했습니다.", imageUrl: null };
  }
};
