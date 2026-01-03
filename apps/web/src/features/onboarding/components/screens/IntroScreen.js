import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProgressIndicator } from "../ProgressIndicator";
export const IntroScreen = ({ onNext, onLogin, progress, }) => {
    return (_jsxs("div", { className: "flex flex-col h-full w-full animate-fade-in p-6", children: [_jsx("header", { className: "absolute top-4 left-6 right-6 h-14 flex items-center justify-center z-10", children: _jsx(ProgressIndicator, { total: 4, current: progress }) }), _jsxs("main", { className: "flex-1 flex flex-col justify-center -mt-14", children: [_jsxs("h1", { className: "text-3xl font-bold leading-tight animate-scale-in text-[#191F28]", children: [_jsx("span", { className: "text-[#F093B0]", children: "3\uAC1C\uC6D4 \uD6C4," }), _jsx("br", {}), "\uC790\uC2E0 \uC788\uAC8C \uB300\uD654\uD558\uB294", _jsx("br", {}), "\uB2F9\uC2E0\uC744 \uB9CC\uB098\uBCF4\uC138\uC694"] }), _jsx("div", { className: "mt-10 space-y-4", children: [
                            "AI와 무제한 대화 연습",
                            "실시간 대화 실력 분석",
                            "실제 이성과 안전한 매칭",
                        ].map((text, i) => (_jsxs("div", { className: "flex items-center opacity-0 animate-fade-in-up", style: {
                                animationDelay: `${i * 100 + 200}ms`,
                                animationFillMode: "forwards",
                            }, children: [_jsx("span", { className: "text-lg mr-3 text-[#0AC5A8]", children: "\u2713" }), _jsx("p", { className: "text-lg font-medium text-[#191F28]", children: text })] }, text))) })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white flex flex-col gap-3", style: { boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.05)" }, children: [_jsx("button", { onClick: onNext, className: "w-full h-14 text-white text-lg font-bold rounded-xl transition-colors duration-300 bg-[var(--primary-pink-main)]", children: "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30" }), _jsxs("div", { className: "flex justify-center items-center gap-2 mt-2", children: [_jsx("p", { className: "text-center text-xs text-gray-400", children: "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?" }), _jsx("button", { onClick: onLogin, className: "text-xs font-bold text-[var(--secondary-blue-main)]", children: "\uB85C\uADF8\uC778" })] })] })] }));
};
