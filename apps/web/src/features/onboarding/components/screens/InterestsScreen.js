import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { OnboardingHeader } from "../OnboardingHeader";
import { FixedBottomButton } from "../FixedBottomButton";
export const InterestsScreen = ({ onComplete, onBack, progress, }) => {
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
    const [selected, setSelected] = useState([]);
    const toggleInterest = (interest) => {
        setSelected((prev) => prev.includes(interest)
            ? prev.filter((i) => i !== interest)
            : prev.length < 5
                ? [...prev, interest]
                : prev);
    };
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress }), _jsxs("main", { className: "flex-1 flex flex-col pt-24", children: [_jsxs("h1", { className: "text-3xl font-bold leading-tight text-[#191F28]", children: ["\uD3C9\uC18C \uAD00\uC2EC \uC788\uB294", _jsx("br", {}), "\uBD84\uC57C\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694"] }), _jsx("p", { className: "text-base mt-2 text-[#8B95A1]", children: "\uACF5\uD1B5 \uAD00\uC2EC\uC0AC\uB85C \uB300\uD654 \uC8FC\uC81C\uB97C \uCD94\uCC9C\uD574\uB4DC\uB824\uC694 (\uCD5C\uC18C 1\uAC1C, \uCD5C\uB300 5\uAC1C)" }), _jsx("div", { className: "mt-8 flex flex-wrap gap-x-2 gap-y-3", children: INTERESTS.map((interest) => {
                            const isSelected = selected.includes(interest);
                            return (_jsxs("button", { onClick: () => toggleInterest(interest), "data-testid": `interest-option-${interest}`, className: `h-12 px-4 flex items-center justify-center rounded-full transition-all duration-200 border text-base font-medium ${isSelected ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]" : "bg-[#F9FAFB] border-[#E5E8EB] text-[#191F28]"}`, children: [isSelected && _jsx("span", { className: "mr-1.5", children: "\u2713" }), interest] }, interest));
                        }) })] }), _jsx(FixedBottomButton, { onClick: () => onComplete(selected), disabled: selected.length === 0, children: selected.length > 0
                    ? "설문 완료하기"
                    : "관심사를 1개 이상 선택해주세요" })] }));
};
