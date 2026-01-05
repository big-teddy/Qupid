import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@qupid/ui";
// Reusable Components
const OnboardingHeader = ({ onBack, progress, total }) => (_jsx("div", { className: "absolute top-0 left-0 right-0 px-4 pt-4 z-10", children: _jsxs("div", { className: "h-14 flex items-center justify-between", children: [_jsx("div", { className: "w-10", children: onBack && (_jsx("button", { onClick: onBack, className: "p-2 -ml-2", children: _jsx(ArrowLeftIcon, { className: "w-6 h-6", style: { color: "var(--text-secondary)" } }) })) }), _jsx("div", { className: "flex items-center justify-center space-x-1.5", children: Array.from({ length: total }).map((_, i) => (_jsx("div", { className: `rounded-full transition-all duration-300 ${i < progress ? "w-2.5 h-2.5 bg-[#F093B0]" : "w-2 h-2 bg-[#E5E8EB]"}` }, i))) }), _jsx("div", { className: "w-10" })] }) }));
const FixedBottomButton = ({ onClick, disabled, children }) => (_jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white", style: { boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.05)" }, children: _jsx("button", { onClick: onClick, disabled: disabled, className: "w-full h-14 text-white text-lg font-bold rounded-xl transition-colors duration-300 disabled:bg-[#F2F4F6] disabled:text-[#8B95A1]", style: {
            backgroundColor: disabled ? undefined : "var(--primary-pink-main)",
        }, children: children }) }));
// 나이대 선택 화면
export const AgeRangeScreen = ({ onNext, onBack, progress, total }) => {
    const [userAge, setUserAge] = useState("");
    const [partnerAge, setPartnerAge] = useState("");
    const ageOptions = [
        { value: "10s", label: "10대 후반", emoji: "🎓" },
        { value: "20s_early", label: "20대 초반", emoji: "🌟" },
        { value: "20s_late", label: "20대 후반", emoji: "💼" },
        { value: "30s", label: "30대", emoji: "🏠" },
        { value: "40s+", label: "40대 이상", emoji: "✨" },
    ];
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress, total: total }), _jsxs("main", { className: "flex-1 flex flex-col pt-24 overflow-y-auto pb-24", children: [_jsx("h1", { className: "text-2xl font-bold leading-tight text-[#191F28]", children: "\uB098\uC774\uB300\uB97C \uC54C\uB824\uC8FC\uC138\uC694" }), _jsx("p", { className: "text-base mt-2 text-[#8B95A1]", children: "\uBE44\uC2B7\uD55C \uB098\uC774\uB300\uC758 AI\uB97C \uCD94\uCC9C\uD574\uB4DC\uB824\uC694" }), _jsxs("div", { className: "mt-6", children: [_jsx("p", { className: "text-sm font-medium text-[#8B95A1] mb-3", children: "\uB0B4 \uB098\uC774\uB300" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ageOptions.map((opt) => (_jsxs("button", { onClick: () => setUserAge(opt.value), className: `px-4 py-3 rounded-xl transition-all ${userAge === opt.value
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB] text-[#191F28]"}`, children: [opt.emoji, " ", opt.label] }, opt.value))) })] }), _jsxs("div", { className: "mt-8", children: [_jsx("p", { className: "text-sm font-medium text-[#8B95A1] mb-3", children: "\uC120\uD638\uD558\uB294 \uC0C1\uB300 \uB098\uC774\uB300" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ageOptions.map((opt) => (_jsxs("button", { onClick: () => setPartnerAge(opt.value), className: `px-4 py-3 rounded-xl transition-all ${partnerAge === opt.value
                                        ? "bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]"
                                        : "bg-[#F9FAFB] border border-[#E5E8EB] text-[#191F28]"}`, children: [opt.emoji, " ", opt.label] }, opt.value))) })] })] }), _jsx(FixedBottomButton, { onClick: () => onNext(userAge, partnerAge), disabled: !userAge || !partnerAge, children: userAge && partnerAge ? "다음" : "나이대를 선택해주세요" })] }));
};
// 목표 선택 화면
export const GoalsScreen = ({ onComplete, onBack, progress, total }) => {
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
    const [selected, setSelected] = useState([]);
    const toggleGoal = (goal) => {
        setSelected((prev) => prev.includes(goal)
            ? prev.filter((g) => g !== goal)
            : prev.length < 3
                ? [...prev, goal]
                : prev);
    };
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress, total: total }), _jsxs("main", { className: "flex-1 flex flex-col pt-24 overflow-y-auto pb-24", children: [_jsxs("h1", { className: "text-2xl font-bold leading-tight text-[#191F28]", children: ["\uB300\uD654 \uC5F0\uC2B5\uC5D0\uC11C", _jsx("br", {}), "\uC774\uB8E8\uACE0 \uC2F6\uC740 \uBAA9\uD45C\uB294?"] }), _jsx("p", { className: "text-base mt-2 text-[#8B95A1]", children: "\uCD5C\uB300 3\uAC1C\uAE4C\uC9C0 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" }), _jsx("div", { className: "mt-6 space-y-3", children: GOALS.map((goal) => {
                            const isSelected = selected.includes(goal.text);
                            return (_jsxs("button", { onClick: () => toggleGoal(goal.text), className: `w-full p-4 flex items-center rounded-xl transition-all ${isSelected
                                    ? "bg-[#FDF2F8] border-2 border-[#F093B0]"
                                    : "bg-[#F9FAFB] border border-[#E5E8EB]"}`, children: [_jsx("span", { className: "text-2xl mr-3", children: goal.emoji }), _jsx("span", { className: `font-medium ${isSelected ? "text-[#DB7093]" : "text-[#191F28]"}`, children: goal.text }), isSelected && (_jsx("span", { className: "ml-auto text-[#F093B0]", children: _jsx(CheckIcon, { className: "w-5 h-5" }) }))] }, goal.text));
                        }) })] }), _jsx(FixedBottomButton, { onClick: () => onComplete(selected), disabled: selected.length === 0, children: selected.length > 0
                    ? `${selected.length}개 선택됨 - 다음`
                    : "목표를 선택해주세요" })] }));
};
// 어려운 상황 선택 화면
export const PainPointsScreen = ({ onComplete, onBack, progress, total }) => {
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
    const [selected, setSelected] = useState([]);
    const togglePainPoint = (point) => {
        setSelected((prev) => prev.includes(point)
            ? prev.filter((p) => p !== point)
            : prev.length < 3
                ? [...prev, point]
                : prev);
    };
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx(OnboardingHeader, { onBack: onBack, progress: progress, total: total }), _jsxs("main", { className: "flex-1 flex flex-col pt-24 overflow-y-auto pb-24", children: [_jsxs("h1", { className: "text-2xl font-bold leading-tight text-[#191F28]", children: ["\uC5B4\uB5A4 \uC0C1\uD669\uC774", _jsx("br", {}), "\uAC00\uC7A5 \uC5B4\uB835\uAC8C \uB290\uAEF4\uC9C0\uB098\uC694?"] }), _jsx("p", { className: "text-base mt-2 text-[#8B95A1]", children: "\uC9D1\uC911 \uC5F0\uC2B5\uC774 \uD544\uC694\uD55C \uBD80\uBD84\uC744 \uC54C\uB824\uC8FC\uC138\uC694 (\uCD5C\uB300 3\uAC1C)" }), _jsx("div", { className: "mt-6 space-y-3", children: PAIN_POINTS.map((point) => {
                            const isSelected = selected.includes(point.text);
                            return (_jsxs("button", { onClick: () => togglePainPoint(point.text), className: `w-full p-4 flex items-center rounded-xl transition-all ${isSelected
                                    ? "bg-[#FDF2F8] border-2 border-[#F093B0]"
                                    : "bg-[#F9FAFB] border border-[#E5E8EB]"}`, children: [_jsx("span", { className: "text-2xl mr-3", children: point.emoji }), _jsx("span", { className: `font-medium ${isSelected ? "text-[#DB7093]" : "text-[#191F28]"}`, children: point.text }), isSelected && (_jsx("span", { className: "ml-auto text-[#F093B0]", children: _jsx(CheckIcon, { className: "w-5 h-5" }) }))] }, point.text));
                        }) })] }), _jsx(FixedBottomButton, { onClick: () => onComplete(selected), disabled: selected.length === 0, children: selected.length > 0
                    ? `${selected.length}개 선택됨 - 다음`
                    : "상황을 선택해주세요" })] }));
};
