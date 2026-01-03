export const PERSONA_GENERATION_SYSTEM_PROMPT = `You are an expert at creating realistic, diverse Korean personas for dating conversations. 
Create personas that are:
- Realistic and believable
- Diverse in age, occupation, and personality
- Compatible but not identical to the user
- Rich in personality and interests
- Natural Korean conversation style`;

export const createPersonaGenerationUserPrompt = (
    count: number,
    targetGenderKorean: string,
    targetGender: string,
    userProfile: {
        name: string;
        age: number;
        gender: string;
        interests: string;
        experience: string;
        mbti: string;
    }
) => `Create ${count} diverse Korean ${targetGenderKorean} personas for dating conversations.

## USER PROFILE (대화 상대)
- Name: ${userProfile.name}
- Age: ${userProfile.age}세
- Gender: ${userProfile.gender}
- Interests (관심사): ${userProfile.interests}
- Experience: ${userProfile.experience}
- MBTI: ${userProfile.mbti}

## ⚠️ 필수 요구사항 (CRITICAL REQUIREMENTS)

### 1. 성별 (GENDER) - 절대 필수
- 모든 페르소나는 반드시 **${targetGenderKorean} (${targetGender})**이어야 합니다
- 사용자가 ${userProfile.gender === "male" ? "남성" : "여성"}이므로, ${targetGenderKorean}만 생성

### 2. 관심사 매칭 (INTEREST MATCHING) - 필수
- 각 페르소나는 사용자의 관심사 [${userProfile.interests}] 중 **최소 1-2개를 반드시 공유**해야 함
- 공유하는 관심사를 interests 배열에 포함시킬 것
- 사용자와 대화할 때 공통 관심사로 자연스럽게 연결될 수 있어야 함

### 3. 다양성 (DIVERSITY)
- ${count}명의 완전히 다른 개성 있는 페르소나 생성
- 다양한 나이 (20-35세), 직업, MBTI 유형
- 현실적인 한국 이름

## RESPONSE FORMAT (JSON)
{
  "personas": [
    {
      "name": "한국 ${targetGenderKorean} 이름",
      "age": 25,
      "gender": "${targetGender}",
      "job": "구체적인 직업",
      "mbti": "ENFP",
      "intro": "간단한 자기소개 (한국어, 2-3문장)",
      "tags": ["성격태그1", "성격태그2", "성격태그3"],
      "match_rate": 85,
      "personality_traits": ["특성1", "특성2", "특성3"],
      "interests": [
        {
          "emoji": "🎮",
          "topic": "사용자와 공유하는 관심사",
          "description": "구체적인 설명"
        }
      ],
      "conversation_style": "대화 스타일 설명 (말투, 분위기 등)",
      "compatibility_reason": "사용자와의 궁합 이유 (공통 관심사 언급 포함)"
    }
  ]
}`;
