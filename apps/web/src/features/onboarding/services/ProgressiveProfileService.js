/**
 * ProgressiveProfileService - 점진적 프로파일링 시스템
 *
 * 사용자 행동에 따라 적절한 시점에 추가 정보를 수집하는 트리거 시스템
 * Hinge/Bumble 스타일의 Progressive Profiling 구현
 */
// 트리거 정의
const PROFILE_TRIGGERS = [
    {
        id: 'first_chat_feedback',
        type: 'first_conversation',
        condition: {
            conversationCount: 1,
            notCompleted: ['conversation_feedback'],
        },
        dataToCollect: 'conversation_feedback',
        question: {
            title: '오늘 대화 어땠어요?',
            description: '더 나은 대화를 위해 알려주세요',
            emoji: '💬',
        },
        priority: 10,
        reward: '맞춤형 대화 스타일 적용',
    },
    {
        id: 'third_chat_values',
        type: 'third_conversation',
        condition: {
            conversationCount: 3,
            notCompleted: ['relationship_values'],
        },
        dataToCollect: 'relationship_values',
        question: {
            title: '연애에서 가장 중요한 건?',
            description: '더 나은 조언을 드릴게요',
            emoji: '💕',
        },
        priority: 8,
        reward: '프리미엄 코칭 팁 해금',
    },
    {
        id: 'seventh_day_mbti',
        type: 'seventh_day',
        condition: {
            daysActive: 7,
            notCompleted: ['mbti'],
        },
        dataToCollect: 'mbti',
        question: {
            title: 'MBTI가 뭐예요?',
            description: '성격에 맞는 페르소나 추천해드릴게요',
            emoji: '🔮',
        },
        priority: 7,
        reward: 'MBTI 맞춤 페르소나 추천',
    },
    {
        id: 'fourteenth_day_attachment',
        type: 'fourteenth_day',
        condition: {
            daysActive: 14,
            notCompleted: ['attachment_style'],
        },
        dataToCollect: 'attachment_style',
        question: {
            title: '애착 유형 알아볼까요?',
            description: '더 깊은 연애 인사이트를 제공해요 (선택)',
            emoji: '🧠',
        },
        priority: 5,
    },
    {
        id: 'communication_pref',
        type: 'high_engagement',
        condition: {
            conversationCount: 5,
            notCompleted: ['communication_preference'],
        },
        dataToCollect: 'communication_preference',
        question: {
            title: '대화 스타일 취향',
            description: 'AI 응답을 맞춤 설정해요',
            emoji: '✨',
        },
        priority: 6,
        reward: '맞춤형 AI 응답',
    },
];
/**
 * 프로필 완성도 계산
 */
export function calculateProfileCompleteness(completedDataTypes, hasBasicInfo = true) {
    const checks = {
        basicInfo: hasBasicInfo,
        personality: completedDataTypes.includes('conversation_feedback'),
        conversationStyle: completedDataTypes.includes('communication_preference'),
        mbti: completedDataTypes.includes('mbti'),
        attachmentStyle: completedDataTypes.includes('attachment_style'),
        relationshipGoals: completedDataTypes.includes('relationship_values'),
        interests: completedDataTypes.includes('deal_breakers'),
    };
    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const totalScore = Math.round((completed / total) * 100);
    let level;
    let nextReward;
    if (totalScore < 30) {
        level = 'starter';
        nextReward = 'AI 코치 기능 해금 (50%)';
    }
    else if (totalScore < 60) {
        level = 'growing';
        nextReward = '맞춤형 연애 조언 (75%)';
    }
    else if (totalScore < 100) {
        level = 'engaged';
        nextReward = '프리미엄 페르소나 접근 (100%)';
    }
    else {
        level = 'complete';
    }
    return { ...checks, totalScore, level, nextReward };
}
/**
 * 현재 활성화되어야 할 트리거 확인
 */
export function getActiveProfileTrigger(activity) {
    const eligibleTriggers = PROFILE_TRIGGERS.filter(trigger => {
        const { condition } = trigger;
        // 대화 횟수 조건
        if (condition.conversationCount &&
            activity.conversationCount < condition.conversationCount) {
            return false;
        }
        // 활성 일수 조건
        if (condition.daysActive &&
            activity.daysActive < condition.daysActive) {
            return false;
        }
        // 미완료 조건 확인
        if (condition.notCompleted) {
            const allNotCompleted = condition.notCompleted.every(dt => !activity.completedDataTypes.includes(dt));
            if (!allNotCompleted)
                return false;
        }
        // 완료 조건 확인
        if (condition.hasCompleted) {
            const allCompleted = condition.hasCompleted.every(dt => activity.completedDataTypes.includes(dt));
            if (!allCompleted)
                return false;
        }
        return true;
    });
    if (eligibleTriggers.length === 0)
        return null;
    // 우선순위로 정렬하여 가장 높은 것 반환
    return eligibleTriggers.sort((a, b) => b.priority - a.priority)[0];
}
/**
 * 프로필 트리거 알림 메시지 생성
 */
export function createTriggerNotification(trigger) {
    return {
        title: `${trigger.question.emoji} ${trigger.question.title}`,
        body: trigger.question.description || '프로필을 완성해보세요!',
        action: trigger.reward ? `완료하면: ${trigger.reward}` : '지금 완성하기',
    };
}
export { PROFILE_TRIGGERS };
