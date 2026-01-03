/**
 * EmotionalAnalyzer 테스트
 * 
 * 감정 분석, 강도 계산, 대화 트렌드 분석 테스트
 */

import {
    analyzeMessageEmotion,
    analyzeConversationEmotion,
    getEmotionalResponseGuide,
    generateEmotionalStrategy,
} from '../EmotionalAnalyzer.js';
import type { Message } from '@qupid/core';

// Mock messages 생성 헬퍼
const createMockMessages = (userTexts: string[]): Message[] => {
    const messages: Message[] = [];
    userTexts.forEach((text, idx) => {
        messages.push({
            text,
            sender: 'user',
            timestamp: Date.now(),
        });
        // AI 응답 추가
        messages.push({
            text: '응 그래!',
            sender: 'ai',
            timestamp: Date.now(),
        });
    });
    return messages;
};

describe('EmotionalAnalyzer', () => {
    describe('analyzeMessageEmotion', () => {
        it('should detect happy emotion', () => {
            const result = analyzeMessageEmotion('오늘 너무 좋아! 행복해 ㅋㅋㅋ');
            expect(result.primary).toBe('happy');
            expect(result.confidence).toBeGreaterThan(0);
        });

        it('should detect excited emotion', () => {
            const result = analyzeMessageEmotion('헐 대박!! 진짜???');
            expect(result.primary).toBe('excited');
            expect(result.intensity).toBe('high');
        });

        it('should detect sad emotion', () => {
            const result = analyzeMessageEmotion('힘들어... 요즘 우울해 ㅠㅠ');
            expect(result.primary).toBe('sad');
            expect(result.shouldAcknowledge).toBe(true);
        });

        it('should detect nervous emotion', () => {
            const result = analyzeMessageEmotion('긴장돼... 떨려 ㅠㅠ');
            expect(result.primary).toBe('nervous');
        });

        it('should detect frustrated emotion', () => {
            const result = analyzeMessageEmotion('짜증나 ㅡㅡ 답답해...');
            expect(result.primary).toBe('frustrated');
        });

        it('should detect flirty emotion', () => {
            const result = analyzeMessageEmotion('보고싶어 ♥ 설레 ㅎㅎ');
            expect(result.primary).toBe('flirty');
        });

        it('should detect curious emotion', () => {
            const result = analyzeMessageEmotion('뭔데뭔데? 궁금해! 알려줘~');
            expect(result.primary).toBe('curious');
        });

        it('should default to neutral for unclear messages', () => {
            const result = analyzeMessageEmotion('음');
            expect(result.primary).toBe('neutral');
        });

        it('should calculate high intensity for emphatic messages', () => {
            const result = analyzeMessageEmotion('대박!!!! ㅋㅋㅋㅋㅋ 진짜!!??');
            expect(result.intensity).toBe('high');
        });

        it('should calculate low intensity for calm messages', () => {
            const result = analyzeMessageEmotion('응 좋아');
            expect(result.intensity).toBe('low');
        });
    });

    describe('analyzeConversationEmotion', () => {
        it('should return neutral for empty messages', () => {
            const result = analyzeConversationEmotion([]);
            expect(result.currentEmotion.primary).toBe('neutral');
            expect(result.engagementLevel).toBe('low');
        });

        it('should detect positive trend', () => {
            const messages = createMockMessages([
                '오늘 좋았어!',
                '완전 신나 ㅋㅋ',
                '진짜 행복해!!',
            ]);

            const result = analyzeConversationEmotion(messages);
            expect(result.emotionTrend).toBe('positive');
        });

        it('should detect negative trend', () => {
            const messages = createMockMessages([
                '힘들어...',
                '우울해 ㅠㅠ',
                '슬퍼...',
            ]);

            const result = analyzeConversationEmotion(messages);
            expect(result.emotionTrend).toBe('negative');
        });

        it('should calculate high engagement for long messages', () => {
            const messages = createMockMessages([
                '오늘 회사에서 프로젝트 발표했는데 너무 잘 됐어! 팀장님도 칭찬해주시고',
                '그리고 점심도 맛있는 거 먹었어! 스테이크 진짜 대박이었어 ㅋㅋ',
            ]);

            const result = analyzeConversationEmotion(messages);
            expect(result.engagementLevel).toBe('high');
        });

        it('should calculate low engagement for short messages', () => {
            const messages = createMockMessages([
                '응',
                '어',
                'ㅇㅇ',
            ]);

            const result = analyzeConversationEmotion(messages);
            expect(result.engagementLevel).toBe('low');
        });
    });

    describe('getEmotionalResponseGuide', () => {
        it('should return appropriate guide for happy emotion', () => {
            const emotion = { primary: 'happy', intensity: 'high' as const, shouldAcknowledge: false, confidence: 0.8 };
            const guide = getEmotionalResponseGuide(emotion);

            expect(guide.tone).toContain('기뻐');
            expect(guide.suggestions).toContain('와 진짜?');
            expect(guide.avoidPatterns).toContain('근데');
        });

        it('should return appropriate guide for sad emotion', () => {
            const emotion = { primary: 'sad', intensity: 'medium' as const, shouldAcknowledge: true, confidence: 0.7 };
            const guide = getEmotionalResponseGuide(emotion);

            expect(guide.tone).toContain('공감');
            expect(guide.avoidPatterns).toContain('힘내');
        });

        it('should return supportive guide for frustrated emotion', () => {
            const emotion = { primary: 'frustrated', intensity: 'high' as const, shouldAcknowledge: true, confidence: 0.9 };
            const guide = getEmotionalResponseGuide(emotion);

            expect(guide.tone).toContain('이해');
        });
    });

    describe('generateEmotionalStrategy', () => {
        it('should increase temperature for high intensity emotions', () => {
            const emotion = { primary: 'excited', intensity: 'high' as const, shouldAcknowledge: false, confidence: 0.8 };
            const strategy = generateEmotionalStrategy(emotion, 'positive');

            expect(strategy.temperatureAdjustment).toBeGreaterThan(0);
        });

        it('should decrease temperature for negative trend', () => {
            const emotion = { primary: 'sad', intensity: 'medium' as const, shouldAcknowledge: true, confidence: 0.7 };
            const strategy = generateEmotionalStrategy(emotion, 'negative');

            expect(strategy.temperatureAdjustment).toBeLessThan(0);
        });

        it('should include acknowledgment prompt when needed', () => {
            const emotion = { primary: 'sad', intensity: 'high' as const, shouldAcknowledge: true, confidence: 0.9 };
            const strategy = generateEmotionalStrategy(emotion, 'negative');

            expect(strategy.promptAddition).toContain('공감');
        });

        it('should provide suggested openers', () => {
            const emotion = { primary: 'happy', intensity: 'medium' as const, shouldAcknowledge: false, confidence: 0.7 };
            const strategy = generateEmotionalStrategy(emotion, 'positive');

            expect(strategy.suggestedOpeners.length).toBeGreaterThan(0);
        });
    });
});
