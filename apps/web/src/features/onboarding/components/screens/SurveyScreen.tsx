import React, { useState } from "react";
import { UserProfile } from "@qupid/core";
import { OnboardingHeader } from "../OnboardingHeader";
import { CheckableCard } from "../CheckableCard";

// Local definition or import from types
type NewUserProfile = Omit<
    UserProfile,
    "id" | "created_at" | "isTutorialCompleted"
>;

// Local definition removed, using imported component props

interface SurveyScreenProps {
    onComplete: (field: keyof NewUserProfile, value: string) => void;
    onBack: () => void;
    question: string;
    description: string;
    options: { icon?: string; title: string; subtitle: string }[];
    field: keyof NewUserProfile;
    progress: number;
}

export const SurveyScreen: React.FC<SurveyScreenProps> = ({
    onComplete,
    onBack,
    question,
    description,
    options,
    field,
    progress,
}) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setTimeout(() => onComplete(field, value), 300);
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in p-6">
            <OnboardingHeader onBack={onBack} progress={progress} />
            <main className="flex-1 flex flex-col pt-24">
                <h1 className="text-3xl font-bold leading-tight text-[#191F28]">
                    {question}
                </h1>
                <p className="text-base mt-2 text-[#8B95A1]">{description}</p>
                <div className="mt-8 space-y-3">
                    {options.map((opt) => (
                        <CheckableCard
                            key={opt.title}
                            {...(opt.icon ? { icon: opt.icon } : {})}
                            title={opt.title}
                            {...(opt.subtitle ? { subtitle: opt.subtitle } : {})}
                            checked={selectedValue === opt.title}
                            onClick={() => handleSelect(opt.title)}
                            data-testid={`survey-option-${opt.title}`}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};
