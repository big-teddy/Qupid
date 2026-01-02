import React from "react";
import { Persona } from "@qupid/core";
import { useOnboardingLogic } from "../hooks/useOnboardingLogic";
import { IntroScreen } from "./screens/IntroScreen";
import { GenderSelectionScreen } from "./screens/GenderSelectionScreen";
import { SurveyScreen } from "./screens/SurveyScreen";
import { InterestsScreen } from "./screens/InterestsScreen";
import { CompletionScreen } from "./screens/CompletionScreen";
import { NewUserProfile } from "../types";

export const OnboardingFlow: React.FC<{
  onComplete: (profile: NewUserProfile, tutorialPersona?: Persona) => void;
  onLogin: () => void;
  skipIntro?: boolean;
}> = ({ onComplete, onLogin, skipIntro = false }) => {
  const {
    step,
    profile,
    nextStep,
    prevStep,
    handleGenderSelect,
    handleSurveyComplete,
    handleInterestComplete,
    handleFinalComplete,
  } = useOnboardingLogic(onComplete, skipIntro);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <IntroScreen onNext={nextStep} onLogin={onLogin} progress={1} />;
      case 1:
        return (
          <GenderSelectionScreen
            onNext={handleGenderSelect}
            onBack={prevStep}
            progress={2}
          />
        );
      case 2:
        return (
          <SurveyScreen
            onComplete={handleSurveyComplete}
            onBack={prevStep}
            progress={3}
            question={"이성과의 연애 경험이\n어느 정도인가요?"}
            description="경험에 맞는 적절한 난이도로 시작해드려요"
            options={[
              {
                icon: "😅",
                title: "전혀 없어요",
                subtitle: "처음이라 긴장돼요",
              },
              {
                icon: "🤷‍♂️",
                title: "1-2번 정도",
                subtitle: "경험은 있지만 어색해요",
              },
              {
                icon: "😊",
                title: "몇 번 있어요",
                subtitle: "기본은 할 수 있어요",
              },
              {
                icon: "😎",
                title: "많은 편이에요",
                subtitle: "더 나은 소통을 원해요",
              },
            ]}
            field="experience"
          />
        );
      case 3:
        return (
          <InterestsScreen
            onComplete={handleInterestComplete}
            onBack={prevStep}
            progress={4}
          />
        );
      case 4:
        return (
          <CompletionScreen
            onComplete={handleFinalComplete}
            profile={profile}
            progress={4}
          />
        );
      default:
        return <IntroScreen onNext={nextStep} onLogin={onLogin} progress={1} />;
    }
  };

  // Completion Screen fallback for step 4 (same as case 4, but structure kept for consistency with previous logic)
  if (step === 4) {
    return (
      <div className="h-full w-full flex items-center justify-center relative bg-white">
        <CompletionScreen
          onComplete={handleFinalComplete}
          profile={profile}
          progress={4}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center relative bg-white">
      {renderStep()}
    </div>
  );
};
