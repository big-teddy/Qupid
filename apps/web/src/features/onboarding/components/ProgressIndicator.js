import { jsx as _jsx } from "react/jsx-runtime";
/**
 * 온보딩 진행률 표시 컴포넌트
 */
export const ProgressIndicator = ({ current, total, }) => (_jsx("div", { className: "flex gap-1.5 w-full max-w-[180px] mx-auto", children: Array.from({ length: total }).map((_, i) => (_jsx("div", { className: `h-1.5 flex-1 rounded-full transition-all duration-300 ${i < current ? "bg-[#0AC5A8]" : "bg-[#E5E8EB]"}` }, i))) }));
export default ProgressIndicator;
