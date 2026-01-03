import { getConsistentAvatar } from "../../../shared/utils/avatarGenerator";
import Logger from "../../../shared/utils/logger";
// Convert API response to Persona type
const convertToPersona = (result) => {
    const data = result;
    return {
        id: String(data.id || "generated-persona"),
        name: String(data.name || "알 수 없음"),
        age: Number(data.age) || 25,
        gender: (data.gender === "male" || data.gender === "female") ? data.gender : "female",
        avatar: String(data.avatar || ""),
        job: String(data.occupation || data.job || "직업 미정"),
        mbti: String(data.personality || data.mbti || "ENFP"),
        intro: String(data.conversationStyle || data.intro || `반가워요!`),
        tags: Array.isArray(data.interests) ? data.interests.slice(0, 3) : [],
        match_rate: 85,
        system_instruction: `당신은 ${data.name}입니다. 자연스럽고 친근한 대화를 나누세요.`,
        personality_traits: Array.isArray(data.values) ? data.values.slice(0, 3) : [],
        interests: Array.isArray(data.interests)
            ? data.interests.slice(0, 3).map((topic) => ({
                emoji: "✨",
                topic,
                description: `${topic}에 관심이 있어요`,
            }))
            : [],
        conversation_preview: [{ sender: "ai", text: "안녕하세요! 반가워요 😊" }],
    };
};
export const generateTutorialPersona = async (profile, generatePersonaMutation) => {
    try {
        Logger.info("🚀 튜토리얼 페르소나 생성 시작:", profile);
        const interests = profile.interests.map((i) => i.split(" ")[1] || i);
        Logger.debug("📝 페르소나 생성 요청 데이터:", {
            userGender: profile.user_gender,
            userInterests: interests,
            isTutorial: true,
        });
        const result = await generatePersonaMutation.mutateAsync({
            userGender: profile.user_gender,
            userInterests: interests,
            isTutorial: true,
        });
        const persona = convertToPersona(result);
        Logger.info("✅ 튜토리얼 페르소나 생성 성공:", persona);
        return persona;
    }
    catch (error) {
        Logger.error("❌ 페르소나 생성 실패, 기본 페르소나 사용:", error);
        return createFallbackPersona(profile);
    }
};
export const createFallbackPersona = (profile) => {
    const partnerGender = profile.user_gender === "male" ? "female" : "male";
    const interests = profile.interests.map((i) => i.split(" ")[1] || i);
    const personaName = partnerGender === "female" ? "김서현" : "박지훈";
    return {
        id: "tutorial-persona-fallback",
        name: personaName,
        age: 25,
        gender: partnerGender,
        job: partnerGender === "female" ? "초등학교 교사" : "소프트웨어 개발자",
        mbti: partnerGender === "female" ? "ENFP" : "ISFJ",
        avatar: getConsistentAvatar(personaName, partnerGender),
        intro: partnerGender === "female"
            ? "아이들과 함께하는 일을 좋아해요 ✨"
            : "코딩과 기술에 관심이 많아요 💻",
        tags: partnerGender === "female"
            ? ["교육", "아이들", "활발함"]
            : ["코딩", "기술", "차분함"],
        match_rate: 85,
        system_instruction: `당신은 ${partnerGender === "female" ? "25세 초등학교 교사 김서현" : "25세 소프트웨어 개발자 박지훈"}입니다. ${partnerGender === "female" ? "ENFP" : "ISFJ"} 성격을 가지고 있으며, 자연스럽고 친근한 대화를 나누세요.`,
        personality_traits: partnerGender === "female"
            ? ["외향적", "친근함", "활발함"]
            : ["내향적", "차분함", "신중함"],
        interests: partnerGender === "female"
            ? [
                {
                    emoji: "👶",
                    topic: "아이들",
                    description: "아이들과 함께하는 시간을 좋아해요",
                },
                {
                    emoji: "📚",
                    topic: "교육",
                    description: "교육에 대한 열정이 있어요",
                },
                ...interests.slice(0, 2).map((interest) => ({
                    emoji: "✨",
                    topic: interest,
                    description: `${interest}에 관심이 있어요`,
                })),
            ]
            : [
                {
                    emoji: "💻",
                    topic: "코딩",
                    description: "새로운 기술을 배우는 걸 좋아해요",
                },
                {
                    emoji: "🎮",
                    topic: "게임",
                    description: "게임 개발에 관심이 있어요",
                },
                ...interests.slice(0, 2).map((interest) => ({
                    emoji: "✨",
                    topic: interest,
                    description: `${interest}에 관심이 있어요`,
                })),
            ],
        conversation_preview: [{ sender: "ai", text: "안녕하세요! 반가워요 😊" }],
    };
};
