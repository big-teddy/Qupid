import { jsx as _jsx } from "react/jsx-runtime";
import { useOnboardingLogic } from "../hooks/useOnboardingLogic";
import { IntroScreen } from "./screens/IntroScreen";
import { GenderSelectionScreen } from "./screens/GenderSelectionScreen";
import { SurveyScreen } from "./screens/SurveyScreen";
import { InterestsScreen } from "./screens/InterestsScreen";
import { CompletionScreen } from "./screens/CompletionScreen";
export const OnboardingFlow = ({ onComplete, onLogin, skipIntro = false }) => {
    const { step, profile, nextStep, prevStep, handleGenderSelect, handleSurveyComplete, handleInterestComplete, handleFinalComplete, } = useOnboardingLogic(onComplete, skipIntro);
    const renderStep = () => {
        switch (step) {
            case 0:
                return _jsx(IntroScreen, { onNext: nextStep, onLogin: onLogin, progress: 1 });
            case 1:
                return (_jsx(GenderSelectionScreen, { onNext: handleGenderSelect, onBack: prevStep, progress: 2 }));
            case 2:
                return (_jsx(SurveyScreen, { onComplete: handleSurveyComplete, onBack: prevStep, progress: 3, question: "이성과의 연애 경험이\n어느 정도인가요?", description: "\uACBD\uD5D8\uC5D0 \uB9DE\uB294 \uC801\uC808\uD55C \uB09C\uC774\uB3C4\uB85C \uC2DC\uC791\uD574\uB4DC\uB824\uC694", options: [
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
                    ], field: "experience" }));
            case 3:
                return (_jsx(InterestsScreen, { onComplete: handleInterestComplete, onBack: prevStep, progress: 4 }));
            case 4:
                return (_jsx(CompletionScreen, { onComplete: handleFinalComplete, profile: profile, progress: 4 }));
            default:
                return _jsx(IntroScreen, { onNext: nextStep, onLogin: onLogin, progress: 1 });
        }
    };
    return (_jsx("div", { className: "min-h-screen w-full bg-gray-50 flex items-center justify-center", children: _jsx("div", { className: "h-full w-full max-w-md bg-white relative flex flex-col shadow-xl overflow-hidden min-h-[800px]", children: renderStep() }) }));
};
