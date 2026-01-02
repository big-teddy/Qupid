/**
 * QuickPersonalityCheck - 빠른 성격 체크 (온보딩용)
 * 
 * 2-4개의 간단한 질문으로 사용자의 기본 성격 유형을 파악
 * Hinge/Bumble 스타일의 게이미피케이션 적용
 */

import React, { useState } from "react";

// 성격 체크 결과 타입
export interface PersonalityCheckResult {
    socialStyle: 'introvert' | 'extrovert' | 'ambivert';
    communicationStyle: 'direct' | 'indirect' | 'balanced';
    datePreference: 'active' | 'chill' | 'mixed';
    relationshipGoal: 'casual' | 'serious' | 'exploring';
}

// 개별 질문 타입
interface PersonalityQuestion {
    id: string;
    question: string;
    emoji: string;
    options: {
        value: string;
        label: string;
        icon: string;
        description?: string;
    }[];
    mapToField: keyof PersonalityCheckResult;
}

// 질문 데이터
const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
    {
        id: 'social',
        question: '주말에 주로 어떻게 보내요?',
        emoji: '🌙',
        options: [
            { value: 'introvert', label: '집에서 혼자 시간', icon: '🏠', description: '나만의 시간이 최고' },
            { value: 'extrovert', label: '친구들이랑 약속', icon: '🎉', description: '사람 만나는 게 좋아' },
            { value: 'ambivert', label: '상황에 따라 다름', icon: '🔄', description: '그때그때 달라요' },
        ],
        mapToField: 'socialStyle',
    },
    {
        id: 'communication',
        question: '관심있는 사람에게 어떻게 다가가요?',
        emoji: '💬',
        options: [
            { value: 'direct', label: '먼저 적극적으로', icon: '🚀', description: '좋으면 바로 말해요' },
            { value: 'indirect', label: '은근히 시그널로', icon: '💫', description: '눈치 줘야지~' },
            { value: 'balanced', label: '상대에 맞춰서', icon: '🎭', description: '상황 봐가면서' },
        ],
        mapToField: 'communicationStyle',
    },
    {
        id: 'date',
        question: '이상적인 데이트는?',
        emoji: '💑',
        options: [
            { value: 'active', label: '활동적인 데이트', icon: '🏃', description: '운동, 여행, 모험' },
            { value: 'chill', label: '조용한 데이트', icon: '☕', description: '카페, 영화, 산책' },
            { value: 'mixed', label: '다양하게 둘 다', icon: '🎲', description: '매번 새로운 거!' },
        ],
        mapToField: 'datePreference',
    },
    {
        id: 'goal',
        question: '지금 연애에서 원하는 건?',
        emoji: '💘',
        options: [
            { value: 'casual', label: '가볍게 시작', icon: '🌱', description: '천천히 알아가기' },
            { value: 'serious', label: '진지한 만남', icon: '💍', description: '결혼까지 생각' },
            { value: 'exploring', label: '아직 모르겠어', icon: '🔮', description: '일단 만나보자' },
        ],
        mapToField: 'relationshipGoal',
    },
];

interface QuickPersonalityCheckProps {
    onComplete: (result: PersonalityCheckResult) => void;
    onBack?: () => void;
    progress?: number;
    questionsToShow?: number; // 보여줄 질문 수 (기본 2개)
}

/**
 * 빠른 성격 체크 화면
 */
export function QuickPersonalityCheck({
    onComplete,
    onBack,
    progress = 0,
    questionsToShow = 2,
}: QuickPersonalityCheckProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Partial<PersonalityCheckResult>>({});

    // 보여줄 질문들 (처음 N개만)
    const questionsToDisplay = PERSONALITY_QUESTIONS.slice(0, questionsToShow);
    const currentQuestion = questionsToDisplay[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questionsToDisplay.length - 1;

    const handleSelectOption = (value: string) => {
        const field = currentQuestion.mapToField;
        const newAnswers = { ...answers, [field]: value };
        setAnswers(newAnswers);

        if (isLastQuestion) {
            // 선택되지 않은 필드에 기본값 설정
            const completeResult: PersonalityCheckResult = {
                socialStyle: (newAnswers.socialStyle as PersonalityCheckResult['socialStyle']) || 'ambivert',
                communicationStyle: (newAnswers.communicationStyle as PersonalityCheckResult['communicationStyle']) || 'balanced',
                datePreference: (newAnswers.datePreference as PersonalityCheckResult['datePreference']) || 'mixed',
                relationshipGoal: (newAnswers.relationshipGoal as PersonalityCheckResult['relationshipGoal']) || 'exploring',
            };
            onComplete(completeResult);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else if (onBack) {
            onBack();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4">
                <button
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <span className="text-xl">←</span>
                </button>

                {/* 진행률 */}
                <div className="flex items-center gap-2">
                    {questionsToDisplay.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 w-8 rounded-full transition-colors ${idx <= currentQuestionIndex
                                ? 'bg-purple-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
            </div>

            {/* 질문 영역 */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="text-6xl mb-6 animate-bounce">
                    {currentQuestion.emoji}
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                    {currentQuestion.question}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    {currentQuestionIndex + 1} / {questionsToDisplay.length}
                </p>

                {/* 선택지 */}
                <div className="w-full max-w-md space-y-3">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelectOption(option.value)}
                            className={`
                w-full p-4 rounded-2xl border-2 transition-all duration-200
                flex items-center gap-4
                hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20
                ${answers[currentQuestion.mapToField] === option.value
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                                }
              `}
                        >
                            <span className="text-3xl">{option.icon}</span>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    {option.label}
                                </p>
                                {option.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 건너뛰기 옵션 */}
            <div className="p-4 text-center">
                <button
                    onClick={() => {
                        // 기본값으로 완료
                        onComplete({
                            socialStyle: 'ambivert',
                            communicationStyle: 'balanced',
                            datePreference: 'mixed',
                            relationshipGoal: 'exploring',
                        });
                    }}
                    className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    나중에 할게요
                </button>
            </div>
        </div>
    );
}

export default QuickPersonalityCheck;
export { PERSONALITY_QUESTIONS };
