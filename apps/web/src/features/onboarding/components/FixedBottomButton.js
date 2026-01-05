import { jsx as _jsx } from "react/jsx-runtime";
/**
 * 하단 고정 버튼 컴포넌트
 */
export const FixedBottomButton = ({ onClick, disabled = false, children, }) => (_jsx("div", { className: "fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F2F4F6]", children: _jsx("button", { onClick: onClick, disabled: disabled, className: `w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${disabled
            ? "bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed"
            : "bg-[#0AC5A8] text-white hover:bg-[#09B199] active:scale-[0.98]"}`, children: children }) }));
export default FixedBottomButton;
