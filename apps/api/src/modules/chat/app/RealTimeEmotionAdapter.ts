/**
 * RealTimeEmotionAdapter - 실시간 감정 적응 시스템
 * 
 * 감정 상태에 따른 LLM 파라미터 동적 조정 및 응답 전략 생성
 * ChatService와 통합하여 더 자연스러운 대화 경험 제공
 */

import type { Message } from "@qupid/core";
import {
    analyzeMessageEmotion,
    analyzeConversationEmotion,
    getEmotionalResponseGuide,
    type EmotionState,
} from "./EmotionalAnalyzer.js";

// =====================================================
// Types
// =====================================================

export interface AdaptiveParameters {
    // LLM 파라미터 조정
    temperature: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;

    // 응답 스타일 가이드
    targetLength: 'short' | 'medium' | 'long';
    responseStyle: 'energetic' | 'calm' | 'supportive' | 'playful' | 'neutral';
    emojiUsage: 'more' | 'less' | 'normal';

    // 컨텍스트 힌트
    openingPhrases: string[];
    avoidPhrases: string[];
    specialInstructions: string[];
}

export interface EmotionalContext {
    currentEmotion: EmotionState;
    emotionHistory: EmotionState[];
    emotionTrend: 'positive' | 'neutral' | 'negative' | 'volatile';
    engagementLevel: 'high' | 'medium' | 'low';
    conversationPhase: 'opening' | 'developing' | 'deep' | 'closing';
    needsEmotionalSupport: boolean;
    isFlirting: boolean;
}

// =====================================================
// Emotion History Tracking
// =====================================================

/**
 * 감정 히스토리에서 변동성 분석
 */
function analyzeEmotionVolatility(history: EmotionState[]): 'volatile' | 'stable' {
    if (history.length < 3) return 'stable';

    let changes = 0;
    for (let i = 1; i < history.length; i++) {
        if (history[i].primary !== history[i - 1].primary) {
            changes++;
        }
    }

    // 50% 이상 변화 = 변동적
    return changes / (history.length - 1) >= 0.5 ? 'volatile' : 'stable';
}

/**
 * 대화 단계 판별
 */
function determineConversationPhase(
    messageCount: number,
    emotionContext: EmotionState
): 'opening' | 'developing' | 'deep' | 'closing' {
    if (messageCount <= 4) return 'opening';
    if (messageCount <= 10) return 'developing';

    // 깊은 대화 감지 (슬픔, 불안, 좌절 등)
    const deepEmotions = ['sad', 'nervous', 'frustrated'];
    if (deepEmotions.includes(emotionContext.primary) && emotionContext.intensity !== 'low') {
        return 'deep';
    }

    return 'developing';
}

/**
 * 감정 지원 필요성 판단
 */
function needsEmotionalSupport(emotion: EmotionState): boolean {
    const supportEmotions = ['sad', 'nervous', 'frustrated'];
    return supportEmotions.includes(emotion.primary) &&
        emotion.intensity !== 'low';
}

/**
 * 플러팅 상황 감지
 */
function isFlirtingContext(emotion: EmotionState, messages: Message[]): boolean {
    if (emotion.primary === 'flirty') return true;

    // 최근 메시지에서 플러팅 키워드 확인
    const recentUserMessages = messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.text)
        .join(' ');

    const flirtyKeywords = ['좋아', '보고싶', '설레', '심쿵', '귀여', '예쁘', '멋있'];
    return flirtyKeywords.some(k => recentUserMessages.includes(k));
}

// =====================================================
// Adaptive Parameters Generation
// =====================================================

/**
 * 감정 상태에 따른 기본 LLM 파라미터
 */
const EMOTION_BASE_PARAMS: Record<string, Partial<AdaptiveParameters>> = {
    happy: {
        temperature: 0.95,
        maxTokens: 180,
        responseStyle: 'energetic',
        emojiUsage: 'more',
        targetLength: 'medium',
    },
    excited: {
        temperature: 1.0,
        maxTokens: 160,
        responseStyle: 'energetic',
        emojiUsage: 'more',
        targetLength: 'short',
    },
    curious: {
        temperature: 0.85,
        maxTokens: 200,
        responseStyle: 'playful',
        emojiUsage: 'normal',
        targetLength: 'medium',
    },
    nervous: {
        temperature: 0.7,
        maxTokens: 150,
        responseStyle: 'calm',
        emojiUsage: 'less',
        targetLength: 'short',
    },
    sad: {
        temperature: 0.75,
        maxTokens: 180,
        responseStyle: 'supportive',
        emojiUsage: 'less',
        targetLength: 'medium',
    },
    frustrated: {
        temperature: 0.7,
        maxTokens: 150,
        responseStyle: 'supportive',
        emojiUsage: 'less',
        targetLength: 'short',
    },
    flirty: {
        temperature: 0.9,
        maxTokens: 150,
        responseStyle: 'playful',
        emojiUsage: 'normal',
        targetLength: 'short',
    },
    neutral: {
        temperature: 0.85,
        maxTokens: 180,
        responseStyle: 'neutral',
        emojiUsage: 'normal',
        targetLength: 'medium',
    },
};

/**
 * 응답 스타일에 따른 시작 문구
 */
const STYLE_OPENING_PHRASES: Record<string, string[]> = {
    energetic: ['와!', '오!', '대박!', '헐!', '진짜?!'],
    calm: ['응응', '그렇구나', '음', '그래~', '아'],
    supportive: ['그랬구나...', '힘들었겠다', '괜찮아?', '어떻게 된 거야?'],
    playful: ['ㅋㅋ', '뭔데뭔데', '오~', '어 왜?', '그게 뭐야'],
    neutral: ['응', '그래', '맞아', '음', '어'],
};

/**
 * 실시간 감정 컨텍스트 생성
 */
export function buildEmotionalContext(messages: Message[]): EmotionalContext {
    const analysis = analyzeConversationEmotion(messages);
    const userMessages = messages.filter(m => m.sender === 'user');

    // 감정 히스토리 구성
    const emotionHistory = userMessages.slice(-5).map(m => analyzeMessageEmotion(m.text));
    const volatility = analyzeEmotionVolatility(emotionHistory);

    // 트렌드 결정 (변동성 고려)
    let emotionTrend: EmotionalContext['emotionTrend'] = analysis.emotionTrend;
    if (volatility === 'volatile') {
        emotionTrend = 'volatile';
    }

    return {
        currentEmotion: analysis.currentEmotion,
        emotionHistory,
        emotionTrend,
        engagementLevel: analysis.engagementLevel,
        conversationPhase: determineConversationPhase(messages.length, analysis.currentEmotion),
        needsEmotionalSupport: needsEmotionalSupport(analysis.currentEmotion),
        isFlirting: isFlirtingContext(analysis.currentEmotion, messages),
    };
}

/**
 * 감정 기반 적응형 파라미터 생성
 */
export function generateAdaptiveParameters(
    context: EmotionalContext,
): AdaptiveParameters {
    const emotion = context.currentEmotion.primary;
    const baseParams = EMOTION_BASE_PARAMS[emotion] || EMOTION_BASE_PARAMS.neutral;
    const guide = getEmotionalResponseGuide(context.currentEmotion);

    // 기본 파라미터
    let params: AdaptiveParameters = {
        temperature: baseParams.temperature || 0.85,
        maxTokens: baseParams.maxTokens || 180,
        frequencyPenalty: 0.3,
        presencePenalty: 0.1,
        targetLength: baseParams.targetLength || 'medium',
        responseStyle: baseParams.responseStyle || 'neutral',
        emojiUsage: baseParams.emojiUsage || 'normal',
        openingPhrases: STYLE_OPENING_PHRASES[baseParams.responseStyle || 'neutral'] || [],
        avoidPhrases: guide.avoidPatterns,
        specialInstructions: [],
    };

    // 감정 강도에 따른 조정
    if (context.currentEmotion.intensity === 'high') {
        params.temperature = Math.min(params.temperature + 0.05, 1.0);
        params.specialInstructions.push('상대방 감정이 강해요. 더 적극적으로 반응해주세요.');
    }

    // 감정 지원 필요 시
    if (context.needsEmotionalSupport) {
        params.temperature = Math.max(params.temperature - 0.1, 0.6);
        params.responseStyle = 'supportive';
        params.specialInstructions.push('상대방이 감정적으로 힘든 상태예요. 조언보다 공감해주세요.');
        params.avoidPhrases = [...params.avoidPhrases, '힘내', '괜찮아질거야', '그러지마'];
    }

    // 플러팅 상황
    if (context.isFlirting) {
        params.responseStyle = 'playful';
        params.specialInstructions.push('설레는 분위기예요. 살짝 수줍은 반응도 좋아요.');
    }

    // 감정 변동이 심할 때
    if (context.emotionTrend === 'volatile') {
        params.temperature = 0.8;
        params.specialInstructions.push('감정 변화가 빠르니 신중하게 반응해주세요.');
    }

    // 참여도에 따른 조정
    if (context.engagementLevel === 'high') {
        params.maxTokens = Math.min(params.maxTokens + 20, 200);
    } else if (context.engagementLevel === 'low') {
        params.targetLength = 'short';
        params.maxTokens = 120;
        params.specialInstructions.push('상대방 답변이 짧아요. 흥미를 끌 수 있는 질문을 해보세요.');
    }

    // 대화 단계에 따른 조정
    if (context.conversationPhase === 'opening') {
        params.targetLength = 'short';
        params.specialInstructions.push('첫 대화니까 가볍고 친근하게!');
    } else if (context.conversationPhase === 'deep') {
        params.targetLength = 'medium';
        params.specialInstructions.push('깊은 대화 중이에요. 진지하게 반응해주세요.');
    }

    return params;
}

/**
 * 프롬프트에 추가할 감정 가이드 문자열 생성
 */
export function buildEmotionalPromptAddition(
    context: EmotionalContext,
    params: AdaptiveParameters,
): string {
    const lines: string[] = [];

    lines.push('## 🎭 감정 상황 인식');
    lines.push(`- 현재 감정: ${context.currentEmotion.primary} (${context.currentEmotion.intensity})`);
    lines.push(`- 분위기: ${context.emotionTrend === 'positive' ? '긍정적' : context.emotionTrend === 'negative' ? '부정적' : '보통'}`);
    lines.push(`- 대화 단계: ${context.conversationPhase}`);

    if (params.specialInstructions.length > 0) {
        lines.push('');
        lines.push('## 💡 특별 지시');
        params.specialInstructions.forEach(inst => {
            lines.push(`- ${inst}`);
        });
    }

    lines.push('');
    lines.push('## 🗣️ 이번 응답 가이드');
    lines.push(`- 스타일: ${params.responseStyle}`);
    lines.push(`- 길이: ${params.targetLength === 'short' ? '20자 이내' : params.targetLength === 'medium' ? '30자 이내' : '40자 이내'}`);

    if (params.openingPhrases.length > 0) {
        lines.push(`- 시작 예시: "${params.openingPhrases.slice(0, 3).join('", "')}"`);
    }

    if (params.avoidPhrases.length > 0) {
        lines.push(`- 피해야 할 표현: "${params.avoidPhrases.slice(0, 3).join('", "')}"`);
    }

    return lines.join('\n');
}

/**
 * 완전한 감정 적응 결과 생성
 */
export function createEmotionAdaptedResponse(messages: Message[]): {
    context: EmotionalContext;
    parameters: AdaptiveParameters;
    promptAddition: string;
} {
    const context = buildEmotionalContext(messages);
    const parameters = generateAdaptiveParameters(context);
    const promptAddition = buildEmotionalPromptAddition(context, parameters);

    return { context, parameters, promptAddition };
}

export default {
    buildEmotionalContext,
    generateAdaptiveParameters,
    buildEmotionalPromptAddition,
    createEmotionAdaptedResponse,
};
