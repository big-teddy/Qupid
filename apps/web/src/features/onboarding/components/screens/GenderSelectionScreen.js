import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { OnboardingHeader } from "../OnboardingHeader";
import { CheckableCard } from "../CheckableCard";
import { FixedBottomButton } from "../FixedBottomButton";
export const GenderSelectionScreen = ({ onNext, onBack, progress, }) => {
    const [selected, setSelected] = useState(null);
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress }), _jsxs("main", { className: "flex-1 flex flex-col pt-24", children: [_jsx("h1", { className: "text-[28px] font-bold", style: { color: "#191F28" }, children: "\uBCF8\uC778\uC758 \uC131\uBCC4\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsx("p", { className: "text-base mt-2", style: { color: "#8B95A1" }, children: "\uC131\uBCC4\uC5D0 \uB530\uB77C \uB9DE\uCDA4 AI\uB97C \uCD94\uCC9C\uD574\uB4DC\uB824\uC694" }), _jsxs("div", { className: "mt-10 space-y-4", children: [_jsx(CheckableCard, { icon: "\uD83D\uDC68", title: "\uB0A8\uC131", subtitle: "\uB0A8\uC131\uC73C\uB85C \uC120\uD0DD\uD558\uC2DC\uBA74 \uC5EC\uC131 AI\uC640 \uB300\uD654 \uC5F0\uC2B5\uD574\uC694", checked: selected === "male", onClick: () => setSelected("male") }), _jsx(CheckableCard, { icon: "\uD83D\uDC69", title: "\uC5EC\uC131", subtitle: "\uC5EC\uC131\uC73C\uB85C \uC120\uD0DD\uD558\uC2DC\uBA74 \uB0A8\uC131 AI\uC640 \uB300\uD654 \uC5F0\uC2B5\uD574\uC694", checked: selected === "female", onClick: () => setSelected("female") })] })] }), _jsx(FixedBottomButton, { onClick: () => selected && onNext(selected), disabled: !selected, children: selected ? "다음 단계로" : "성별을 선택해주세요" })] }));
};
