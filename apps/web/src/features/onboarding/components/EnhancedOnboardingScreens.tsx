import React, { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@qupid/ui";

// Reusable Components
const OnboardingHeader: React.FC<{
    onBack?: () => void;
    progress: number;
    total: number;
}> = ({ onBack, progress, total }) => (
    <div className="absolute top-0 left-0 right-0 px-4 pt-4 z-10">
        <div className="h-14 flex items-center justify-between">
            <div className="w-10">
                {onBack && (
                    <button onClick={onBack} className="p-2 -ml-2">
                        <ArrowLeftIcon
                            className="w-6 h-6"
                            style={{ color: "var(--text-secondary)" }}
                        />
                    </button>
                )}
            </div>
            <div className="flex items-center justify-center space-x-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${i < progress ? "w-2.5 h-2.5 bg-[#F093B0]" : "w-2 h-2 bg-[#E5E8EB]"
                            }`}
                    />
                ))}
            </div>
            <div className="w-10"></div>
        </div>
    </div>
);

const FixedBottomButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
    <div
        className="absolute bottom-0 left-0 right-0 p-4 bg-white"
        style={{ boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.05)" }}
    >
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full h-14 text-white text-lg font-bold rounded-xl transition-colors duration-300 disabled:bg-[#F2F4F6] disabled:text-[#8B95A1]"
            style={{
                backgroundColor: disabled ? undefined : "var(--primary-pink-main)",
            }}
        >
            {children}
        </button>
    </div>
);

// 나이대 선택 화면
export const AgeRangeScreen: React.FC<{
    onNext: (userAge: string, partnerAge: string) => void;
    onBack: () => void;
    progress: number;
    total: number;
}> = ({ onNext, onBack, progress, total }) => {
    const [userAge, setUserAge] = useState<string>("");
    const [partnerAge, setPartnerAge] = useState<string>("");

    const ageOptions = [
        { value: "10s", label: "10대 후반", emoji: "🎓" },
        { value: "20s_early", label: "20대 초반", emoji: "🌟" },
        { value: "20s_late", label: "20대 후반", emoji: "💼" },
        { value: "30s", label: "30대", emoji: "🏠" },
        { value: "40s+", label: "40대 이상", emoji: "✨" },
    ];

    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} total={total} />
            <main className="flex-1 flex flex-col pt-24 overflow-y-auto pb-24">
                <h1 className="text-2xl font-bold leading-tight text-[#191F28]">
                    나이대를 알려주세요
                </h1>
                <p className="text-base mt-2 text-[#8B95A1]">
                    비슷한 나이대의 AI를 추천해드려요
                </p>

                <div className="mt-6">
                    <p className="text-sm font-medium text-[#8B95A1] mb-3">내 나이대</p>
                    <div className="flex flex-wrap gap-2">
                        {ageOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setUserAge(opt.value)}
                                className={`px-4 py-3 rounded-xl transition-all ${userAge === opt.value
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB] text-[#191F28]"
                                    }`}
                            >
                                {opt.emoji} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-sm font-medium text-[#8B95A1] mb-3">
                        선호하는 상대 나이대
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {ageOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setPartnerAge(opt.value)}
                                className={`px-4 py-3 rounded-xl transition-all ${partnerAge === opt.value
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB] text-[#191F28]"
                                    }`}
                            >
                                {opt.emoji} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
            <FixedBottomButton
                onClick={() => onNext(userAge, partnerAge)}
                disabled={!userAge || !partnerAge}
            >
                {userAge && partnerAge ? "다음" : "나이대를 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};

// 목표 선택 화면
export const GoalsScreen: React.FC<{
    onComplete: (goals: string[]) => void;
    onBack: () => void;
    progress: number;
    total: number;
}> = ({ onComplete, onBack, progress, total }) => {
    const GOALS = [
        { emoji: "💪", text: "자신감 키우기" },
        { emoji: "💬", text: "자연스럽게 대화 시작하기" },
        { emoji: "😂", text: "유머 감각 향상" },
        { emoji: "💕", text: "호감 표현법 익히기" },
        { emoji: "👂", text: "경청 능력 향상" },
        { emoji: "🔥", text: "대화 이어가기" },
        { emoji: "🧘", text: "거절 잘 받아들이기" },
        { emoji: "💑", text: "깊은 대화 나누기" },
    ];
    const [selected, setSelected] = useState<string[]>([]);

    const toggleGoal = (goal: string) => {
        setSelected((prev) =>
            prev.includes(goal)
                ? prev.filter((g) => g !== goal)
                : prev.length < 3
                    ? [...prev, goal]
                    : prev
        );
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} total={total} />
            <main className="flex-1 flex flex-col pt-24 overflow-y-auto pb-24">
                <h1 className="text-2xl font-bold leading-tight text-[#191F28]">
                    대화 연습에서
                    <br />
                    이루고 싶은 목표는?
                </h1>
                <p className="text-base mt-2 text-[#8B95A1]">
                    최대 3개까지 선택해주세요
                </p>
                <div className="mt-6 space-y-3">
                    {GOALS.map((goal) => {
                        const isSelected = selected.includes(goal.text);
                        return (
                            <button
                                key={goal.text}
                                onClick={() => toggleGoal(goal.text)}
                                className={`w-full p-4 flex items-center rounded-xl transition-all ${isSelected
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB]"
                                    }`}
                            >
                                <span className="text-2xl mr-3">{goal.emoji}</span>
                                <span
                                    className={`font-medium ${isSelected ? "text-[#DB7093]" : "text-[#191F28]"}`}
                                >
                                    {goal.text}
                                </span>
                                {isSelected && (
                                    <span className="ml-auto text-[#F093B0]">
                                        <CheckIcon className="w-5 h-5" />
                                    </span>
                                )}
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
                    ? `${selected.length}개 선택됨 - 다음`
                    : "목표를 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};

// 어려운 상황 선택 화면
export const PainPointsScreen: React.FC<{
    onComplete: (painPoints: string[]) => void;
    onBack: () => void;
    progress: number;
    total: number;
}> = ({ onComplete, onBack, progress, total }) => {
    const PAIN_POINTS = [
        { emoji: "😰", text: "첫 만남이 어색해요" },
        { emoji: "🤐", text: "대화 주제가 떠오르지 않아요" },
        { emoji: "💗", text: "호감 표현이 어려워요" },
        { emoji: "📱", text: "메시지 답장이 고민돼요" },
        { emoji: "🚫", text: "거절하는 게 힘들어요" },
        { emoji: "🏃", text: "대화가 빨리 끝나요" },
        { emoji: "😅", text: "농담이 잘 안 통해요" },
        { emoji: "❤️", text: "적절한 스킨십 타이밍을 모르겠어요" },
    ];
    const [selected, setSelected] = useState<string[]>([]);

    const togglePainPoint = (point: string) => {
        setSelected((prev) =>
            prev.includes(point)
                ? prev.filter((p) => p !== point)
                : prev.length < 3
                    ? [...prev, point]
                    : prev
        );
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} total={total} />
            <main className="flex-1 flex flex-col pt-24 overflow-y-auto pb-24">
                <h1 className="text-2xl font-bold leading-tight text-[#191F28]">
                    어떤 상황이
                    <br />
                    가장 어렵게 느껴지나요?
                </h1>
                <p className="text-base mt-2 text-[#8B95A1]">
                    집중 연습이 필요한 부분을 알려주세요 (최대 3개)
                </p>
                <div className="mt-6 space-y-3">
                    {PAIN_POINTS.map((point) => {
                        const isSelected = selected.includes(point.text);
                        return (
                            <button
                                key={point.text}
                                onClick={() => togglePainPoint(point.text)}
                                className={`w-full p-4 flex items-center rounded-xl transition-all ${isSelected
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB]"
                                    }`}
                            >
                                <span className="text-2xl mr-3">{point.emoji}</span>
                                <span
                                    className={`font-medium ${isSelected ? "text-[#DB7093]" : "text-[#191F28]"}`}
                                >
                                    {point.text}
                                </span>
                                {isSelected && (
                                    <span className="ml-auto text-[#F093B0]">
                                        <CheckIcon className="w-5 h-5" />
                                    </span>
                                )}
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
                    ? `${selected.length}개 선택됨 - 다음`
                    : "상황을 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};
