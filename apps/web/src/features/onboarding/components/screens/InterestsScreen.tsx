import React, { useState } from "react";
import { OnboardingHeader } from "../OnboardingHeader";
import { FixedBottomButton } from "../FixedBottomButton";

interface InterestsScreenProps {
    onComplete: (interests: string[]) => void;
    onBack: () => void;
    progress: number;
}

export const InterestsScreen: React.FC<InterestsScreenProps> = ({
    onComplete,
    onBack,
    progress,
}) => {
    const INTERESTS = [
        "🎮 게임",
        "🎬 영화/드라마",
        "💪 운동/헬스",
        "✈️ 여행",
        "🍕 맛집/요리",
        "📚 독서",
        "🎵 음악",
        "🎨 예술/문화",
        "📱 IT/테크",
        "🐕 반려동물",
        "☕ 카페투어",
        "📷 사진",
    ];
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        setSelected((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 5
                    ? [...prev, interest]
                    : prev,
        );
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} />
            <main className="flex-1 flex flex-col pt-24">
                <h1 className="text-3xl font-bold leading-tight text-[#191F28]">
                    평소 관심 있는
                    <br />
                    분야를 선택해주세요
                </h1>
                <p className="text-base mt-2 text-[#8B95A1]">
                    공통 관심사로 대화 주제를 추천해드려요 (최소 1개, 최대 5개)
                </p>
                <div className="mt-8 flex flex-wrap gap-x-2 gap-y-3">
                    {INTERESTS.map((interest) => {
                        const isSelected = selected.includes(interest);
                        return (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                data-testid={`interest-option-${interest}`}
                                className={`h-12 px-4 flex items-center justify-center rounded-full transition-all duration-200 border text-base font-medium ${isSelected ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]" : "bg-[#F9FAFB] border-[#E5E8EB] text-[#191F28]"}`}
                            >
                                {isSelected && <span className="mr-1.5">✓</span>}
                                {interest}
                            </button>
                        );
                    })}
                </div>
            </main>
            <FixedBottomButton
                onClick={() => onComplete(selected)}
                disabled={selected.length === 0}
            >
                {selected.length > 0
                    ? "설문 완료하기"
                    : "관심사를 1개 이상 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};
