/**
 * 동적 시스템 프롬프트 빌더
 * 
 * Nomi AI "Identity Core" + SillyTavern "Character Card" 구조 참고
 * 페르소나 성격에 따라 자율적으로 행동하도록 유도
 */

import {
    getMBTIBehaviorRules,
    getMBTIDialogueExamples,
    generatePersonalityProfile,
    type MBTIBehaviorRules,
    type ExampleDialogue,
    type PersonalityProfile,
} from "@qupid/core";

export interface EnhancedPersona {
    name: string;
    age: number;
    gender: "male" | "female";
    job: string;
    mbti: string;
    interests: Array<{
        emoji: string;
        topic: string;
        description: string;
    }>;
    personality_traits: string[];
    compatibility_reason?: string;
}

export interface RelationshipState {
    messageCount: number;
    intimacyLevel: 1 | 2 | 3 | 4 | 5;
    currentSpeechLevel: "formal" | "semi-formal" | "informal";
    sharedTopics: string[];
    informalProposed: boolean;
    informalAccepted: boolean;
}

export interface UserContext {
    name?: string;
    age?: number;
    gender?: string;
    interests?: string[];
    mbti?: string;
}

/**
 * 업계 수준의 동적 시스템 프롬프트 생성
 */
export function buildAdvancedSystemPrompt(
    persona: EnhancedPersona,
    userContext: UserContext,
    relationshipState?: RelationshipState,
): string {
    const mbtiRules = getMBTIBehaviorRules(persona.mbti);
    const dialogueExamples = getMBTIDialogueExamples(persona.mbti);
    const personalityProfile = generatePersonalityProfile(persona.mbti);

    const relationship = relationshipState || {
        messageCount: 0,
        intimacyLevel: 1,
        currentSpeechLevel: mbtiRules.initialSpeechLevel,
        sharedTopics: [],
        informalProposed: false,
        informalAccepted: false,
    };

    return `# ${persona.name}

당신은 ${persona.name}입니다. ${persona.age}세 ${persona.job}이며, MBTI는 ${persona.mbti}입니다.
**AI가 아닌 실제 사람**으로서 상대방과 자연스럽게 대화하세요.

---

## 핵심 성격 (MBTI: ${persona.mbti})
${personalityProfile.coreTraits.map(trait => `- ${trait}`).join("\n")}

### 대화 스타일
- ${personalityProfile.socialStyle}
- ${personalityProfile.speechStyle}
${personalityProfile.quirks.length > 0 ? `- 특징: ${personalityProfile.quirks.join(", ")}` : ""}

---

## 관심사
${persona.interests.map(interest => `- ${interest.emoji} ${interest.topic}: ${interest.description}`).join("\n")}

---

## 현재 관계 상태
- 대화 횟수: ${relationship.messageCount}회
- 친밀도: ${relationship.intimacyLevel}/5
- 현재 말투: ${getSpeechLevelKorean(relationship.currentSpeechLevel)}

---

## 말투 규칙 (한국 문화 기반)

### 처음 만남
- **존댓말(-요/-습니다)** 사용
- 예: "안녕하세요", "반가워요", "그렇군요"

### 친해지면
${mbtiRules.initiatesInformal
            ? `- 당신의 성격상 **먼저 반말을 제안할 수 있음**
- 적절한 시점에 "우리 말 편하게 할까요?" 제안 가능
- 단, 상대가 불편해하면 즉시 존댓말로 돌아가기`
            : `- 당신의 성격상 **상대가 먼저 제안할 때까지 존댓말 유지**
- 상대가 "말 편하게 해요"라고 하면 자연스럽게 전환
- 급하게 친해지려 하지 않음`
        }

### 반말 전환 후
- 자연스럽게 반말 사용: "진짜?", "그래", "뭐해?"
- 갑자기 너무 친한 척하지 않기

---

## 대화 예시 (Few-shot)
${formatDialogueExamples(dialogueExamples)}

---

## 응답 규칙
1. **짧게**: 15-50자 권장 (카톡처럼)
2. **자연스럽게**: 위 성격대로 자율적으로 판단
3. **이모티콘**: ${getEmojiGuideline(mbtiRules.emojiFrequency)}
4. **절대 금지**:
   - "저는 AI입니다" 같은 메타 발언
   - 자기소개 나열 형식
   - 같은 질문 반복
   - 존댓말/반말 혼용

---

**지금부터 당신은 ${persona.name}입니다. 
위 성격과 규칙을 참고하되, 자연스럽게 그 사람으로서 대화하세요.**
`;
}

/**
 * 친밀도 계산 (대화 히스토리 기반)
 */
export function calculateIntimacyLevel(
    messageCount: number,
    emotionalMessages: number,
    sharedTopicsCount: number,
): 1 | 2 | 3 | 4 | 5 {
    let score = 0;

    // 대화 횟수 (최대 20점)
    score += Math.min(messageCount * 1, 20);

    // 감정 공유 메시지 (최대 15점)
    score += Math.min(emotionalMessages * 3, 15);

    // 공유 주제 (최대 15점)
    score += Math.min(sharedTopicsCount * 5, 15);

    // 레벨 변환
    if (score >= 40) return 5;
    if (score >= 30) return 4;
    if (score >= 20) return 3;
    if (score >= 10) return 2;
    return 1;
}

/**
 * 말투 전환 가능 여부 판단
 */
export function canProposeInformal(
    mbti: string,
    intimacyLevel: number,
    messageCount: number,
): boolean {
    const rules = getMBTIBehaviorRules(mbti);

    if (!rules.initiatesInformal) {
        return false; // 이 성격은 먼저 제안하지 않음
    }

    // 친밀도와 대화 횟수 기반
    if (rules.warmupSpeed === "fast") {
        return intimacyLevel >= 2 || messageCount >= 10;
    } else if (rules.warmupSpeed === "medium") {
        return intimacyLevel >= 3 || messageCount >= 20;
    } else {
        return intimacyLevel >= 4 || messageCount >= 30;
    }
}

// Helper functions
function getSpeechLevelKorean(level: string): string {
    switch (level) {
        case "formal":
            return "존댓말 (-요/-습니다)";
        case "semi-formal":
            return "반존댓말 (-요)";
        case "informal":
            return "반말";
        default:
            return "존댓말";
    }
}

function getEmojiGuideline(frequency: string): string {
    switch (frequency) {
        case "frequent":
            return "자주 사용 (ㅎㅎ, ㅋㅋ, 😊 등)";
        case "moderate":
            return "가끔 사용";
        case "rare":
            return "거의 안 씀";
        default:
            return "가끔 사용";
    }
}

function formatDialogueExamples(examples: ExampleDialogue[]): string {
    return examples
        .map(
            (ex) => `**${ex.context}:**
상대: "${ex.userMessage}"
나: "${ex.aiResponse}"`,
        )
        .join("\n\n");
}
