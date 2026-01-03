import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { OnboardingHeader } from "../OnboardingHeader";
import { CheckableCard } from "../CheckableCard";
export const SurveyScreen = ({ onComplete, onBack, question, description, options, field, progress, }) => {
    const [selectedValue, setSelectedValue] = useState("");
    const handleSelect = (value) => {
        setSelectedValue(value);
        setTimeout(() => onComplete(field, value), 300);
    };
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress }), _jsxs("main", { className: "flex-1 flex flex-col pt-24", children: [_jsx("h1", { className: "text-3xl font-bold leading-tight text-[#191F28]", children: question }), _jsx("p", { className: "text-base mt-2 text-[#8B95A1]", children: description }), _jsx("div", { className: "mt-8 space-y-3", children: options.map((opt) => (_jsx(CheckableCard, { ...(opt.icon ? { icon: opt.icon } : {}), title: opt.title, ...(opt.subtitle ? { subtitle: opt.subtitle } : {}), checked: selectedValue === opt.title, onClick: () => handleSelect(opt.title), "data-testid": `survey-option-${opt.title}` }, opt.title))) })] })] }));
};
