/**
 * RealTimeEmotionAdapter 테스트
 * 
 * 실시간 감정 적응, 파라미터 조정, 프롬프트 생성 테스트
 */

import {
    buildEmotionalContext,
    generateAdaptiveParameters,
    buildEmotionalPromptAddition,
    createEmotionAdaptedResponse,
} from '../RealTimeEmotionAdapter.js';
import type { Message } from '@qupid/core';

// Mock messages 생성 헬퍼
const createMockMessages = (
    texts: string[],
    options?: { allUser?: boolean }
): Message[] => {
    return texts.map((text, idx) => {
        const sender: "user" | "ai" = options?.allUser ? 'user' : (idx % 2 === 0 ? 'user' : 'ai');
        return {
            text,
            sender,
            timestamp: Date.now(),
        };
    });
};

describe('RealTimeEmotionAdapter', () => {
    describe('buildEmotionalContext', () => {
        it('should build context from messages', () => {
            const messages = createMockMessages([
                '안녕!',
                '안녕~ 뭐해?',
                '그냥 쉬고 있어 ㅎㅎ',
                '좋겠다!',
            ]);

            const context = buildEmotionalContext(messages);

            expect(context.currentEmotion).toBeDefined();
            expect(context.emotionHistory).toBeDefined();
            expect(context.conversationPhase).toBe('opening');
        });

        it('should detect developing phase after more messages', () => {
            const messages = createMockMessages([
                '안녕!', '안녕~',
                '오늘 뭐했어?', '카페 갔어',
                '우와 좋겠다', '응 좋았어',
                '나도 가고싶다', '같이가!',
                '진짜?', '응!',
                '언제?', '주말에!',
            ]);

            const context = buildEmotionalContext(messages);

            expect(context.conversationPhase).toBe('developing');
        });

        it('should detect deep phase for emotional messages', () => {
            const messages = createMockMessages([
                '안녕', '안녕',
                '요즘 힘들어...', '왜?',
                '회사에서 걱정이 많아', '그랬구나',
                '진짜 불안해 ㅠㅠ', '괜찮아?',
            ]);

            const context = buildEmotionalContext(messages);

            expect(context.conversationPhase).toBe('deep');
            expect(context.needsEmotionalSupport).toBe(true);
        });

        it('should detect flirting context', () => {
            const messages = createMockMessages([
                '오늘 뭐해?', '너 생각 ㅎㅎ',
                '뭐야 ㅋㅋ', '보고싶어 ♥',
                '나도 설레 ㅎㅎ', '진짜?',
            ]);

            const context = buildEmotionalContext(messages);

            expect(context.isFlirting).toBe(true);
        });

        it('should detect volatile emotion trend', () => {
            const messages: Message[] = [
                { text: '너무 좋아!!', sender: 'user', timestamp: Date.now() },
                { text: '좋다~', sender: 'ai', timestamp: Date.now() },
                { text: '근데 슬퍼 ㅠㅠ', sender: 'user', timestamp: Date.now() },
                { text: '왜?', sender: 'ai', timestamp: Date.now() },
                { text: '아 짜증나', sender: 'user', timestamp: Date.now() },
                { text: '무슨일이야', sender: 'ai', timestamp: Date.now() },
                { text: '헐 대박!!', sender: 'user', timestamp: Date.now() },
                { text: '??', sender: 'ai', timestamp: Date.now() },
                { text: '힘들어...', sender: 'user', timestamp: Date.now() },
                { text: '괜찮아?', sender: 'ai', timestamp: Date.now() },
            ];

            const context = buildEmotionalContext(messages);

            expect(context.emotionTrend).toBe('volatile');
        });
    });

    describe('generateAdaptiveParameters', () => {
        it('should generate higher temperature for happy emotion', () => {
            const context = buildEmotionalContext(
                createMockMessages(['너무 좋아!! 행복해 ㅋㅋㅋ', '나도!'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.temperature).toBeGreaterThanOrEqual(0.9);
            expect(params.responseStyle).toBe('energetic');
            expect(params.emojiUsage).toBe('more');
        });

        it('should generate lower temperature for sad emotion', () => {
            const context = buildEmotionalContext(
                createMockMessages(['힘들어... 우울해 ㅠㅠ', '괜찮아?'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.temperature).toBeLessThanOrEqual(0.8);
            expect(params.responseStyle).toBe('supportive');
            expect(params.emojiUsage).toBe('less');
        });

        it('should add special instructions for emotional support', () => {
            const context = buildEmotionalContext(
                createMockMessages(['너무 불안해... 걱정돼 ㅠㅠ', '왜?'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.specialInstructions.length).toBeGreaterThan(0);
            expect(params.specialInstructions.some(i => i.includes('공감'))).toBe(true);
        });

        it('should adjust for low engagement', () => {
            const context = buildEmotionalContext(
                createMockMessages(['응', '그래', 'ㅇㅇ', '응'], { allUser: true })
            );

            const params = generateAdaptiveParameters(context);

            expect(params.targetLength).toBe('short');
            expect(params.specialInstructions.some(i => i.includes('질문'))).toBe(true);
        });

        it('should adjust for flirting context', () => {
            const context = buildEmotionalContext(
                createMockMessages(['보고싶어 ♥', '나도~', '설레 ㅎㅎ', '나도!'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.responseStyle).toBe('playful');
        });

        it('should provide opening phrases', () => {
            const context = buildEmotionalContext(
                createMockMessages(['안녕!', '안녕~'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.openingPhrases.length).toBeGreaterThan(0);
        });

        it('should provide avoid phrases', () => {
            const context = buildEmotionalContext(
                createMockMessages(['힘들어 ㅠㅠ', '괜찮아?'])
            );

            const params = generateAdaptiveParameters(context);

            expect(params.avoidPhrases.length).toBeGreaterThan(0);
        });
    });

    describe('buildEmotionalPromptAddition', () => {
        it('should include emotion information', () => {
            const context = buildEmotionalContext(
                createMockMessages(['너무 좋아!', '나도!'])
            );
            const params = generateAdaptiveParameters(context);

            const prompt = buildEmotionalPromptAddition(context, params);

            expect(prompt).toContain('감정');
            expect(prompt).toContain('스타일');
        });

        it('should include special instructions when present', () => {
            const context = buildEmotionalContext(
                createMockMessages(['힘들어... ㅠㅠ', '왜?'])
            );
            const params = generateAdaptiveParameters(context);

            const prompt = buildEmotionalPromptAddition(context, params);

            expect(prompt).toContain('특별 지시');
        });

        it('should include conversation phase', () => {
            const context = buildEmotionalContext(
                createMockMessages(['안녕!', '안녕~'])
            );
            const params = generateAdaptiveParameters(context);

            const prompt = buildEmotionalPromptAddition(context, params);

            expect(prompt).toContain('대화 단계');
        });
    });

    describe('createEmotionAdaptedResponse', () => {
        it('should return complete adaptation result', () => {
            const messages = createMockMessages([
                '안녕! 오늘 기분 좋아',
                '좋다! 뭐했어?',
            ]);

            const result = createEmotionAdaptedResponse(messages);

            expect(result.context).toBeDefined();
            expect(result.parameters).toBeDefined();
            expect(result.promptAddition).toBeDefined();
            expect(result.parameters.temperature).toBeGreaterThan(0);
            expect(result.parameters.maxTokens).toBeGreaterThan(0);
        });

        it('should provide consistent results for same input', () => {
            const messages = createMockMessages(['안녕!', '안녕~']);

            const result1 = createEmotionAdaptedResponse(messages);
            const result2 = createEmotionAdaptedResponse(messages);

            expect(result1.parameters.temperature).toBe(result2.parameters.temperature);
            expect(result1.context.currentEmotion.primary).toBe(result2.context.currentEmotion.primary);
        });
    });
});
