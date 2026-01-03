/**
 * EmotionalAnalyzer - 감정 분석 및 대응
 * 
 * 사용자 메시지에서 감정을 감지하고 적절한 대응 전략 제공
 */

import type { Message } from "@qupid/core";

// 감정 상태
export interface EmotionState {
    primary: string;           // 주요 감정
    intensity: 'low' | 'medium' | 'high';  // 강도
    shouldAcknowledge: boolean; // 감정 인정 필요 여부
    confidence: number;        // 감지 신뢰도 (0-1)
}

// 감정별 키워드 패턴
const EMOTION_PATTERNS: Record<string, { keywords: string[]; enhancers: string[] }> = {
    happy: {
        keywords: ['좋아', '행복', '기뻐', '신나', '즐거', '최고', '짱', '대박'],
        enhancers: ['ㅋㅋㅋ', '!!', 'ㅎㅎㅎ', '♥', '❤'],
    },
    excited: {
        keywords: ['와', '오', '헐', '대박', '진짜', '미쳤', '완전'],
        enhancers: ['!!', '???', 'ㅋㅋㅋㅋ', '!!!!'],
    },
    curious: {
        keywords: ['뭐야', '어떻게', '왜', '뭔데', '궁금', '알려줘', '말해줘'],
        enhancers: ['?', '??', '???'],
    },
    nervous: {
        keywords: ['긴장', '떨려', '불안', '걱정', '어색', '무서'],
        enhancers: ['...', 'ㅠㅠ', 'ㅜㅜ'],
    },
    sad: {
        keywords: ['슬퍼', '우울', '힘들', '지쳤', '피곤', '싫어', '별로'],
        enhancers: ['ㅠㅠ', 'ㅜㅜ', '...', 'ㅎ..'],
    },
    frustrated: {
        keywords: ['짜증', '화나', '열받', '짜증나', '답답', '이해가', '모르겠'],
        enhancers: ['ㅡㅡ', '-_-', ';;;', '...'],
    },
    flirty: {
        keywords: ['좋아해', '보고싶', '예쁘', '멋있', '설레', '두근', '심쿵'],
        enhancers: ['♥', '❤', '///', 'ㅎㅎ'],
    },
    neutral: {
        keywords: ['응', '그래', '어', '음', '뭐', '그렇'],
        enhancers: [],
    },
};

// 감정에 따른 응답 가이드
const EMOTIONAL_RESPONSE_GUIDES: Record<string, {
    tone: string;
    suggestions: string[];
    avoidPatterns: string[];
}> = {
    happy: {
        tone: '같이 기뻐하며 밝게',
        suggestions: ['와 진짜?', '나도 좋아!', '완전!'],
        avoidPatterns: ['근데', '그런데', '하지만'],
    },
    excited: {
        tone: '큰 리액션으로 함께 신나하기',
        suggestions: ['헐 대박!', '뭔데뭔데!', '와 어떻게!'],
        avoidPatterns: ['음...', '그렇구나'],
    },
    curious: {
        tone: '친절하게 설명하며 관심 보이기',
        suggestions: ['오 궁금해?', '알려줄까?', '그거 재밌는데!'],
        avoidPatterns: ['몰라', '관심없어'],
    },
    nervous: {
        tone: '편안하게 대해주며 부담 줄이기',
        suggestions: ['괜찮아', '천천히', '긴장 풀어~'],
        avoidPatterns: ['빨리', '어서', '왜 그래'],
    },
    sad: {
        tone: '공감하고 위로하며 들어주기',
        suggestions: ['무슨 일이야?', '괜찮아?', '말해줘'],
        avoidPatterns: ['그러지마', '힘내', '왜 그래'],
    },
    frustrated: {
        tone: '이해한다고 공감하기',
        suggestions: ['그랬구나...', '힘들었겠다', '맞아 그럴 수 있어'],
        avoidPatterns: ['근데', '그래도', '잘 생각해봐'],
    },
    flirty: {
        tone: '적절히 반응하며 설렘 표현',
        suggestions: ['어 왜~', 'ㅎㅎ', '나도...'],
        avoidPatterns: ['뭔데', '갑자기', '왜 그래'],
    },
    neutral: {
        tone: '자연스럽게 대화 이어가기',
        suggestions: ['응응', '그래~', '맞아'],
        avoidPatterns: [],
    },
};

/**
 * 메시지에서 감정 강도 계산
 */
function calculateIntensity(message: string): 'low' | 'medium' | 'high' {
    const exclamations = (message.match(/!/g) || []).length;
    const questions = (message.match(/\?/g) || []).length;
    const emoticons = (message.match(/[ㅋㅎㅠㅜ]{2,}/g) || []).length;
    const hearts = (message.match(/[♥❤💕]/g) || []).length;

    const intensityScore = exclamations + questions * 0.5 + emoticons + hearts * 2;

    if (intensityScore >= 4) return 'high';
    if (intensityScore >= 2) return 'medium';
    return 'low';
}

/**
 * 단일 메시지에서 감정 분석
 */
export function analyzeMessageEmotion(message: string): EmotionState {
    const lowerMessage = message.toLowerCase();
    const scores: { emotion: string; score: number }[] = [];

    // 각 감정별 점수 계산
    Object.entries(EMOTION_PATTERNS).forEach(([emotion, patterns]) => {
        let score = 0;

        // 키워드 매칭
        patterns.keywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                score += 2;
            }
        });

        // 인핸서 매칭 (더 강한 감정 신호)
        patterns.enhancers.forEach(enhancer => {
            if (message.includes(enhancer)) {
                score += 1;
            }
        });

        scores.push({ emotion, score });
    });

    // 최고 점수 감정 선택
    scores.sort((a, b) => b.score - a.score);
    const topEmotion = scores[0];

    // 신뢰도 계산
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const confidence = totalScore > 0 ? topEmotion.score / totalScore : 0;

    return {
        primary: topEmotion.score > 0 ? topEmotion.emotion : 'neutral',
        intensity: calculateIntensity(message),
        shouldAcknowledge: topEmotion.score >= 2 && topEmotion.emotion !== 'neutral',
        confidence: Math.min(confidence, 1),
    };
}

/**
 * 대화 흐름에서 감정 트렌드 분석
 */
export function analyzeConversationEmotion(messages: Message[]): {
    currentEmotion: EmotionState;
    emotionTrend: 'positive' | 'neutral' | 'negative';
    engagementLevel: 'high' | 'medium' | 'low';
} {
    const userMessages = messages.filter(m => m.sender === 'user');

    if (userMessages.length === 0) {
        return {
            currentEmotion: { primary: 'neutral', intensity: 'low', shouldAcknowledge: false, confidence: 0 },
            emotionTrend: 'neutral',
            engagementLevel: 'low',
        };
    }

    // 최근 메시지들의 감정 분석
    const recentMessages = userMessages.slice(-3);
    const emotions = recentMessages.map(m => analyzeMessageEmotion(m.text));
    const currentEmotion = emotions[emotions.length - 1];

    // 감정 트렌드 계산
    const emotionValues: Record<string, number> = {
        happy: 2, excited: 2, flirty: 1, curious: 1,
        neutral: 0,
        nervous: -1, frustrated: -1, sad: -2,
    };

    const avgValue = emotions.reduce((sum, e) => sum + (emotionValues[e.primary] || 0), 0) / emotions.length;
    const emotionTrend = avgValue > 0.5 ? 'positive' : avgValue < -0.5 ? 'negative' : 'neutral';

    // 참여도 계산 (메시지 길이, 빈도 등)
    const avgLength = userMessages.slice(-5).reduce((sum, m) => sum + m.text.length, 0) / Math.min(userMessages.length, 5);
    const engagementLevel = avgLength > 30 ? 'high' : avgLength > 15 ? 'medium' : 'low';

    return { currentEmotion, emotionTrend, engagementLevel };
}

/**
 * 감정에 따른 응답 가이드라인 반환
 */
export function getEmotionalResponseGuide(emotion: EmotionState): {
    tone: string;
    suggestions: string[];
    avoidPatterns: string[];
} {
    return EMOTIONAL_RESPONSE_GUIDES[emotion.primary] || EMOTIONAL_RESPONSE_GUIDES.neutral;
}

/**
 * 감정 기반 응답 전략 생성
 */
export function generateEmotionalStrategy(
    emotion: EmotionState,
    conversationTrend: 'positive' | 'neutral' | 'negative',
): {
    promptAddition: string;
    temperatureAdjustment: number;
    suggestedOpeners: string[];
} {
    const guide = getEmotionalResponseGuide(emotion);

    let temperatureAdjustment = 0;
    let promptAddition = '';

    // 감정 강도에 따른 조정
    if (emotion.intensity === 'high') {
        temperatureAdjustment = 0.05; // 더 다양한 반응
        promptAddition += `상대방이 ${emotion.primary} 감정을 강하게 표현하고 있어요. 적극적으로 반응해주세요!\n`;
    }

    // 감정 인정이 필요한 경우
    if (emotion.shouldAcknowledge) {
        promptAddition += `먼저 "${guide.suggestions[0]}" 같은 반응으로 감정에 공감해주세요.\n`;
    }

    // 부정적 트렌드일 경우
    if (conversationTrend === 'negative') {
        promptAddition += `대화 분위기가 가라앉고 있어요. 더 따뜻하고 공감적으로 대해주세요.\n`;
        temperatureAdjustment -= 0.05; // 더 신중한 응답
    }

    return {
        promptAddition: promptAddition || guide.tone,
        temperatureAdjustment,
        suggestedOpeners: guide.suggestions,
    };
}

export default {
    analyzeMessageEmotion,
    analyzeConversationEmotion,
    getEmotionalResponseGuide,
    generateEmotionalStrategy,
};
