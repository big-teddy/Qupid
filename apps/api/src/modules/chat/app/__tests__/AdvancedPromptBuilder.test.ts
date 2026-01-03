/**
 * AdvancedPromptBuilder 테스트
 * 
 * MBTI 기반 성격 설명, 단계별 전략, 프롬프트 생성 테스트
 */

import {
    buildAdvancedSystemPrompt,
    buildRoleplayPrompt,
    buildCoachingPrompt,
    buildEnhancedPersonaInfo,
    detectConversationMood,
    extractRecentTopics,
    type ConversationContext,
    type UserContext,
} from '../AdvancedPromptBuilder.js';
import type { Persona, Message } from '@qupid/core';

// Mock persona
const mockPersona: Persona = {
    id: 'test-persona-1',
    name: '서현',
    age: 25,
    mbti: 'ENFP',
    job: '초등학교 교사',
    gender: 'female',
    avatar: '/avatars/test.png',
    intro: '안녕하세요!',
    tags: ['여행', '카페', '드라마'],
    match_rate: 85,
    system_instruction: '친절하고 유쿠한 성격',
    personality_traits: ['활발한', '긍정적인'],
    interests: [{ emoji: '✨', topic: '여행', description: '여행 좋아해요' }],
    conversation_preview: [],
};

// Mock messages
const createMockMessages = (texts: string[]): Message[] => {
    return texts.map((text, idx) => {
        const sender: "user" | "ai" = idx % 2 === 0 ? 'user' : 'ai';
        return {
            text,
            sender,
            timestamp: Date.now(),
        };
    });
};

describe('AdvancedPromptBuilder', () => {
    describe('buildEnhancedPersonaInfo', () => {
        it('should build enhanced persona from basic persona', () => {
            const enhanced = buildEnhancedPersonaInfo(mockPersona);

            expect(enhanced.name).toBe('서현');
            expect(enhanced.age).toBe(25);
            expect(enhanced.mbti).toBe('ENFP');
            expect(enhanced.job).toBe('초등학교 교사');
            expect(enhanced.speechStyle.formality).toBe('casual');
            expect(enhanced.expressions.reactions).toBeDefined();
            expect(enhanced.expressions.reactions.length).toBeGreaterThan(0);
        });
    });

    describe('detectConversationMood', () => {
        it('should detect light mood for casual messages', () => {
            const messages = createMockMessages([
                '오늘 뭐했어?',
                '나 카페 갔다왔어!',
                '우와 좋겠다 ㅎㅎ',
                '응 커피 맛있었어',
            ]);

            const mood = detectConversationMood(messages);
            expect(mood).toBe('light');
        });

        it('should detect deep mood for serious messages', () => {
            const messages = createMockMessages([
                '오늘 힘들었어',
                '무슨 일 있어?',
                '회사에서 고민이 있어',
                '무슨 걱정이야?',
            ]);

            const mood = detectConversationMood(messages);
            expect(mood).toBe('deep');
        });

        it('should detect playful mood', () => {
            const messages = createMockMessages([
                '뭐야 ㅋㅋㅋ',
                'ㅋㅋㅋㅋ 장난 아니야',
                '헐 웃겨 ㅋㅋㅋ',
                'ㅎㅎㅎ 진짜?',
            ]);

            const mood = detectConversationMood(messages);
            expect(mood).toBe('playful');
        });
    });

    describe('extractRecentTopics', () => {
        it('should extract food topic', () => {
            const messages = createMockMessages([
                '오늘 치킨 먹었어',
                '우와 맛있었어?',
                '응 카페도 갔어',
            ]);

            const topics = extractRecentTopics(messages);
            expect(topics).toContain('음식');
        });

        it('should extract hobby topic', () => {
            const messages = createMockMessages([
                '요즘 게임 뭐해?',
                '나 롤 하고 있어',
                '영화도 볼거야',
            ]);

            const topics = extractRecentTopics(messages);
            expect(topics).toContain('취미');
        });

        it('should extract multiple topics', () => {
            const messages = createMockMessages([
                '오늘 밥 먹고 게임했어',
                '좋다 나도 영화 봤어',
                '오늘 뭐해?',
            ]);

            const topics = extractRecentTopics(messages);
            expect(topics.length).toBeGreaterThan(1);
        });
    });

    describe('buildAdvancedSystemPrompt', () => {
        it('should include persona info in prompt', () => {
            const context: ConversationContext = {
                turnCount: 3,
                lastUserMessage: '오늘 뭐해?',
                recentTopics: ['일상'],
                conversationMood: 'light',
            };

            const prompt = buildAdvancedSystemPrompt(mockPersona, context);

            expect(prompt).toContain('서현');
            expect(prompt).toContain('25');
            expect(prompt).toContain('ENFP');
            expect(prompt).toContain('초등학교 교사');
        });

        it('should include MBTI description', () => {
            const context: ConversationContext = {
                turnCount: 3,
                lastUserMessage: '안녕',
                recentTopics: [],
                conversationMood: 'light',
            };

            const prompt = buildAdvancedSystemPrompt(mockPersona, context);

            expect(prompt).toContain('열정적이고 상상력이 풍부한');
        });

        it('should include user context if provided', () => {
            const context: ConversationContext = {
                turnCount: 5,
                lastUserMessage: '나 강아지 키워',
                recentTopics: [],
                conversationMood: 'light',
            };

            const userContext: UserContext = {
                name: '민수',
                interests: ['게임', '운동'],
                knownFacts: ['강아지를 키움', '게임을 좋아함'],
            };

            const prompt = buildAdvancedSystemPrompt(mockPersona, context, userContext);

            expect(prompt).toContain('강아지를 키움');
            expect(prompt).toContain('게임을 좋아함');
        });

        it('should include target length based on turn count', () => {
            const earlyContext: ConversationContext = {
                turnCount: 1,
                lastUserMessage: '안녕!',
                recentTopics: [],
                conversationMood: 'light',
            };

            const lateContext: ConversationContext = {
                turnCount: 15,
                lastUserMessage: '그래서 어떻게 됐어?',
                recentTopics: [],
                conversationMood: 'deep',
            };

            const earlyPrompt = buildAdvancedSystemPrompt(mockPersona, earlyContext);
            const latePrompt = buildAdvancedSystemPrompt(mockPersona, lateContext);

            // 초반에는 더 짧은 응답 권장
            expect(earlyPrompt).toContain('25자');
            // 후반에는 더 긴 응답 허용
            expect(latePrompt).toContain('45자');
        });
    });

    describe('buildRoleplayPrompt', () => {
        it('should include scenario information', () => {
            const scenario = {
                title: '첫 만남',
                description: '소개팅에서 처음 만난 상황',
                mission: '자연스럽게 대화 시작하기',
                systemPrompt: '당신은 소개팅에서 만난 사람입니다.',
            };

            const context: ConversationContext = {
                turnCount: 1,
                lastUserMessage: '안녕하세요',
                recentTopics: [],
                conversationMood: 'light',
            };

            const prompt = buildRoleplayPrompt(scenario, mockPersona, context);

            expect(prompt).toContain('첫 만남');
            expect(prompt).toContain('소개팅');
            expect(prompt).toContain('자연스럽게 대화 시작하기');
        });
    });

    describe('buildCoachingPrompt', () => {
        it('should include coach information', () => {
            const coach = {
                name: '코치 민지',
                specialty: '첫 대화 시작하기',
                personality: '따뜻하고 격려하는 스타일',
            };

            const context: ConversationContext = {
                turnCount: 2,
                lastUserMessage: '처음 대화할 때 뭐라고 해야해?',
                recentTopics: ['연애'],
                conversationMood: 'light',
            };

            const prompt = buildCoachingPrompt(coach, context);

            expect(prompt).toContain('코치 민지');
            expect(prompt).toContain('첫 대화');
            expect(prompt).toContain('따뜻하고 격려하는');
        });
    });
});
