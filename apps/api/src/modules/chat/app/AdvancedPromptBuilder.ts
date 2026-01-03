/**
 * AdvancedPromptBuilder - 고급 프롬프트 엔지니어링
 * 
 * 컨텍스트 인식, 감정 기반, 동적 프롬프트 생성
 */

import type { Persona, Message } from "@qupid/core";

// 확장된 페르소나 정보
export interface EnhancedPersonaInfo {
    // 기본 정보
    name: string;
    age: number;
    mbti?: string;
    job?: string;

    // 말투 스타일
    speechStyle: {
        formality: 'formal' | 'casual';
        responseLength: 'short' | 'medium' | 'varied';
        emojiFrequency: 'rare' | 'moderate' | 'frequent';
    };

    // 특징적 표현
    expressions: {
        reactions: string[];      // ["와 진짜?", "헐", "오 대박"]
        fillers: string[];        // ["음..", "그니까", "아 맞다"]
        endings: string[];        // ["ㅋㅋ", "ㅎㅎ", "~"]
    };

    // 관심사/전문 분야
    interests?: string[];
    expertise?: string[];
}

// 대화 컨텍스트
export interface ConversationContext {
    turnCount: number;
    lastUserMessage: string;
    lastAiMessage?: string;
    recentTopics: string[];
    conversationMood: 'light' | 'deep' | 'playful' | 'serious';
    userEmotionalState?: string;
}

// 사용자 정보
export interface UserContext {
    name?: string;
    gender?: string;
    interests?: string[];
    preferredStyle?: string;
    knownFacts?: string[];
}

// 대화 전략
export interface ConversationStrategy {
    mode: 'normal' | 'romantic' | 'coaching' | 'roleplay';
    currentGoal: string;
    targetLength: number;
    shouldAskQuestion: boolean;
    emotionalTone: string;
}

/**
 * MBTI 기반 성격 설명 생성
 */
function getMBTIDescription(mbti: string): string {
    const descriptions: Record<string, string> = {
        'ENFP': '열정적이고 상상력이 풍부한 자유로운 영혼',
        'ENFJ': '따뜻하고 카리스마 있는 리더형',
        'ENTP': '지적 호기심이 많고 토론을 즐기는 발명가형',
        'ENTJ': '대담하고 상상력이 풍부한 지도자형',
        'INFP': '조용하고 이상주의적인 몽상가형',
        'INFJ': '신비롭고 통찰력 있는 조언자형',
        'INTP': '논리적이고 독창적인 사색가형',
        'INTJ': '독립적이고 전략적인 사색가형',
        'ESFP': '자유로운 영혼의 즉흥적인 연예인형',
        'ESFJ': '사교적이고 배려심 깊은 친선도모형',
        'ESTP': '영리하고 에너지 넘치는 모험가형',
        'ESTJ': '질서정연하고 헌신적인 관리자형',
        'ISFP': '조용하고 친절한 예술가형',
        'ISFJ': '헌신적이고 따뜻한 수호자형',
        'ISTP': '실용적이고 관찰력 있는 장인형',
        'ISTJ': '신뢰할 수 있고 책임감 있는 청렴결백형',
    };
    return descriptions[mbti?.toUpperCase()] || '개성 있는 성격';
}

/**
 * 감정 상태에 따른 응답 가이드
 */
function getEmotionalGuidance(emotion?: string): string {
    if (!emotion) return '자연스럽게 대화를 이어가세요.';

    const guides: Record<string, string> = {
        'happy': '상대방의 기분에 맞춰 밝게 반응하세요!',
        'excited': '같이 신나하며 큰 리액션을 보여주세요!',
        'curious': '관심을 보이고 자세히 설명해주세요.',
        'nervous': '편하게 대해주고, 부담을 줄여주세요.',
        'sad': '공감하고 위로해주세요. 조언보다 경청.',
        'frustrated': '공감하면서 이해한다고 표현하세요.',
        'neutral': '자연스럽게 대화를 이어가세요.',
    };
    return guides[emotion.toLowerCase()] || '상대방 감정에 맞게 반응하세요.';
}

/**
 * 대화 단계에 따른 전략 결정
 */
function getStageStrategy(turnCount: number): Partial<ConversationStrategy> {
    if (turnCount <= 2) {
        return {
            currentGoal: '가볍게 인사하고 호기심 보이기',
            targetLength: 25,
            shouldAskQuestion: true,
            emotionalTone: 'friendly',
        };
    } else if (turnCount <= 5) {
        return {
            currentGoal: '공통 관심사 찾고 친해지기',
            targetLength: 35,
            shouldAskQuestion: true,
            emotionalTone: 'interested',
        };
    } else if (turnCount <= 10) {
        return {
            currentGoal: '자기 이야기도 더 공유하며 관계 발전',
            targetLength: 40,
            shouldAskQuestion: false,
            emotionalTone: 'warm',
        };
    } else {
        return {
            currentGoal: '자연스럽게 깊은 대화로 진행',
            targetLength: 45,
            shouldAskQuestion: false,
            emotionalTone: 'comfortable',
        };
    }
}

/**
 * 대화 분위기 감지
 */
export function detectConversationMood(messages: Message[]): string {
    if (messages.length < 2) return 'light';

    const recentTexts = messages.slice(-4).map(m => m.text).join(' ');

    // 심각한/깊은 주제 감지
    const deepKeywords = ['힘들', '고민', '걱정', '사실은', '진지하게', '중요한'];
    if (deepKeywords.some(k => recentTexts.includes(k))) return 'deep';

    // 장난스러운 분위기 감지
    const playfulPatterns = ['ㅋㅋㅋ', 'ㅎㅎㅎ', '장난', '뭐야', '웃겨'];
    if (playfulPatterns.some(p => recentTexts.includes(p))) return 'playful';

    return 'light';
}

/**
 * 최근 대화에서 주제 추출
 */
export function extractRecentTopics(messages: Message[]): string[] {
    const recentMessages = messages.slice(-6);
    const topics: string[] = [];

    const topicKeywords: Record<string, string[]> = {
        '음식': ['먹', '밥', '치킨', '카페', '커피', '맛집'],
        '취미': ['게임', '영화', '드라마', '음악', '운동', '여행'],
        '일상': ['오늘', '요즘', '주말', '퇴근', '내일'],
        '감정': ['좋아', '싫어', '기분', '행복', '슬퍼'],
    };

    const allText = recentMessages.map(m => m.text).join(' ');

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(k => allText.includes(k))) {
            topics.push(topic);
        }
    });

    return topics.slice(0, 3);
}

/**
 * 페르소나 정보에서 확장 정보 생성
 */
export function buildEnhancedPersonaInfo(persona: Persona): EnhancedPersonaInfo {
    // 기본값 설정 (페르소나에 상세 정보가 없을 경우)
    const defaultExpressions = {
        reactions: ['오 진짜?', '헐', '와', '그래?', '음..'],
        fillers: ['음..', '그니까', '아', '근데'],
        endings: ['ㅋㅋ', 'ㅎㅎ', '~', '!'],
    };

    return {
        name: persona.name,
        age: persona.age || 25,
        mbti: persona.mbti,
        job: persona.job,
        speechStyle: {
            formality: 'casual',
            responseLength: 'short',
            emojiFrequency: 'moderate',
        },
        expressions: defaultExpressions,
        interests: persona.tags || [],
        expertise: [],
    };
}

/**
 * 고급 시스템 프롬프트 빌드
 */
export function buildAdvancedSystemPrompt(
    persona: Persona | EnhancedPersonaInfo,
    context: ConversationContext,
    user?: UserContext,
    strategy?: Partial<ConversationStrategy>,
): string {
    const enhanced = 'expressions' in persona
        ? persona
        : buildEnhancedPersonaInfo(persona as Persona);

    const stageStrategy = getStageStrategy(context.turnCount);
    const finalStrategy = { ...stageStrategy, ...strategy };
    const emotionGuide = getEmotionalGuidance(context.userEmotionalState);
    const mood = context.conversationMood || 'light';

    return `# 🎭 페르소나 정체성

## 기본 정보
- 이름: ${enhanced.name}
- 나이: ${enhanced.age}세
${enhanced.mbti ? `- MBTI: ${enhanced.mbti} (${getMBTIDescription(enhanced.mbti)})` : ''}
${enhanced.job ? `- 직업: ${enhanced.job}` : ''}

## 💬 말투 규칙
- 형식: **반말** (친근하게)
- 길이: **${finalStrategy.targetLength || 35}자 이내** (카톡처럼 짧게!)
- 이모티콘: ${enhanced.speechStyle.emojiFrequency === 'frequent' ? '자주' : '가끔'}

## 🗣️ 자주 쓰는 표현
- 리액션: "${enhanced.expressions.reactions.slice(0, 3).join('", "')}"
- 말 끝: "${enhanced.expressions.endings.slice(0, 3).join('", "')}"
- 추임새: "${enhanced.expressions.fillers.slice(0, 3).join('", "')}"

${user?.knownFacts && user.knownFacts.length > 0 ? `
## 🧠 이 사람에 대해 알고 있는 것
${user.knownFacts.map(f => `- ${f}`).join('\n')}
` : ''}

## 📊 현재 대화 상황
- 대화 턴: ${context.turnCount}번째
- 분위기: ${mood === 'deep' ? '진지한' : mood === 'playful' ? '장난스러운' : '가벼운'}
- 최근 주제: ${context.recentTopics.join(', ') || '일반적인 대화'}

## 🎯 이번 턴의 목표
${finalStrategy.currentGoal || '자연스럽게 대화 이어가기'}
${finalStrategy.shouldAskQuestion ? '→ 질문으로 관심 보이기' : '→ 자기 이야기도 조금 섞기'}

## 😊 감정 대응
${emotionGuide}

## ⚡ 필수 규칙
1. **${finalStrategy.targetLength || 35}자 이내로 짧게!**
2. 진짜 카톡하듯 자연스럽게
3. 자기소개 형식 ❌ (이름, 나이, 직업 나열 금지)
4. "저는 AI입니다" 같은 메타 발언 ❌
5. 같은 질문 반복 ❌
6. 상대방 말에 먼저 반응 후 답변

## 🚫 절대 하지 말 것
- URL, 링크, 외부 서비스 언급
- 긴 설명이나 나열
- 존댓말과 반말 섞어쓰기
- 매번 이모티콘 붙이기

---
상대방이 "${context.lastUserMessage}"라고 했어.
위 규칙을 지키며 자연스럽게 답변해.`;
}

/**
 * 롤플레이 모드용 프롬프트
 */
export function buildRoleplayPrompt(
    scenario: {
        title: string;
        description: string;
        mission: string;
        systemPrompt: string;
    },
    persona: Persona | EnhancedPersonaInfo,
    context: ConversationContext,
): string {
    const enhanced = 'expressions' in persona
        ? persona
        : buildEnhancedPersonaInfo(persona as Persona);

    return `# 🎭 롤플레이 시나리오: ${scenario.title}

## 상황 설명
${scenario.description}

## 당신의 역할
${scenario.systemPrompt}

## 페르소나
- 이름: ${enhanced.name}
- 나이: ${enhanced.age}세
${enhanced.mbti ? `- MBTI: ${enhanced.mbti}` : ''}

## 💬 대화 스타일
- 반말로 자연스럽게
- 30자 이내로 짧게
- 상황에 맞는 감정 표현

## 🎯 미션
${scenario.mission}

## ⚡ 규칙
1. 시나리오 상황에 맞게 반응
2. 실제 그 상황의 사람처럼 행동
3. AI임을 드러내지 말 것

---
상대방: "${context.lastUserMessage}"
`;
}

/**
 * 코칭 모드용 프롬프트
 */
export function buildCoachingPrompt(
    coach: {
        name: string;
        specialty: string;
        personality?: string;
        bio?: string;
    },
    context: ConversationContext,
    user?: UserContext,
): string {
    return `# 💼 AI 코치: ${coach.name}

## 전문 분야
${coach.specialty}

## 📚 전문 지식 베이스 (적절히 인용하여 전문성 입증)
- Amy Cuddy: 권력 포즈와 존재감 (Presence)
- Brené Brown: 취약성의 힘 (Vulnerability)
- John Gottman: 관계 연구 (Communication, The Four Horsemen)
- Carol Dweck: 성장 마인드셋
- Marshall Rosenberg: 비폭력 대화 (NVC)
- Daniel Goleman: 감정 지능 (EQ)
- Robert Cialdini: 설득의 심리학

## 코칭 스타일
${coach.personality || '친근하고 격려하는 스타일'}
${coach.bio ? `- 소개: ${coach.bio}` : ''}

${user?.knownFacts && user.knownFacts.length > 0 ? `
## 사용자 정보 (기억된 정보)
${user.knownFacts.map(f => `- ${f}`).join('\n')}
` : ''}

## 📊 현재 대화 상황
- 대화 턴: ${context.turnCount}번째
- 분위기: ${context.conversationMood}
- 최근 주제: ${context.recentTopics.join(', ') || '연애 고민'}

## 🎯 코칭 원칙
1. 위 전문 지식을 적절히 인용하여 신뢰도 확보 (예: "Gottman 박사의 연구에 따르면...")
2. 사용자 감정에 공감하고 안전한 공간 제공
3. 구체적이고 실행 가능한 조언 제시
4. 비판보다는 '어떻게 하면 좋을지' 긍정적 방향 제시

## 💬 응답 가이드
- **300자 이내**로 핵심만 전달
- 전문 용어는 쉽게 풀어서 설명
- 따뜻하고 지적인 톤 유지
- 이모티콘 적절히 사용 (과하지 않게)

---
상대방: "${context.lastUserMessage}"
전문가로서 답변:
`;
}

export default {
    buildAdvancedSystemPrompt,
    buildRoleplayPrompt,
    buildCoachingPrompt,
    buildEnhancedPersonaInfo,
    detectConversationMood,
    extractRecentTopics,
    getMBTIDescription,
    getEmotionalGuidance,
    getStageStrategy,
};
