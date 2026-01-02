import React, { useState } from "react";
import { OnboardingHeader } from "../OnboardingHeader";
import { CheckableCard } from "../CheckableCard";
import { FixedBottomButton } from "../FixedBottomButton";

interface GenderSelectionScreenProps {
    onNext: (gender: "male" | "female") => void;
    onBack: () => void;
    progress: number;
}

export const GenderSelectionScreen: React.FC<GenderSelectionScreenProps> = ({
    onNext,
    onBack,
    progress,
}) => {
    const [selected, setSelected] = useState<"male" | "female" | null>(null);
    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} />
            <main className="flex-1 flex flex-col pt-24">
                <h1 className="text-[28px] font-bold" style={{ color: "#191F28" }}>
                    본인의 성별을 선택해주세요
                </h1>
                <p className="text-base mt-2" style={{ color: "#8B95A1" }}>
                    성별에 따라 맞춤 AI를 추천해드려요
                </p>
                <div className="mt-10 space-y-4">
                    <CheckableCard
                        icon="👨"
                        title="남성"
                        subtitle="남성으로 선택하시면 여성 AI와 대화 연습해요"
                        checked={selected === "male"}
                        onClick={() => setSelected("male")}
                    />
                    <CheckableCard
                        icon="👩"
                        title="여성"
                        subtitle="여성으로 선택하시면 남성 AI와 대화 연습해요"
                        checked={selected === "female"}
                        onClick={() => setSelected("female")}
                    />
                </div>
            </main>
            <FixedBottomButton
                onClick={() => selected && onNext(selected)}
                disabled={!selected}
            >
                {selected ? "다음 단계로" : "성별을 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};
