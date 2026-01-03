import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CoachCard = ({ coach, onStart }) =>
  _jsxs("div", {
    className:
      "p-4 bg-white rounded-xl border border-[#F2F4F6] flex items-center space-x-4 transition-all hover:shadow-lg hover:border-[#DB7093] hover:-translate-y-0.5 cursor-pointer group",
    onClick: onStart,
    children: [
      _jsx("div", {
        className: "flex-shrink-0",
        children: _jsx("img", {
          src: coach.avatar,
          alt: coach.name,
          className:
            "w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-[#DB7093] transition-colors",
        }),
      }),
      _jsxs("div", {
        className: "flex-1 min-w-0",
        children: [
          _jsxs("p", {
            className: "font-bold text-base text-[#191F28] mb-1",
            children: [coach.name, " \uCF54\uCE58"],
          }),
          _jsxs("p", {
            className: "text-sm font-semibold text-[#4F7ABA] mb-1",
            children: [coach.specialty, " \uC804\uBB38"],
          }),
          _jsx("p", {
            className: "text-xs text-[#8B95A1] leading-relaxed",
            children: coach.tagline,
          }),
        ],
      }),
      _jsx("div", {
        className: "flex-shrink-0",
        children: _jsx("button", {
          className:
            "px-4 py-2 bg-[#FDF2F8] text-sm text-[#DB7093] font-bold rounded-full transition-all hover:bg-[#DB7093] hover:text-white hover:shadow-md whitespace-nowrap",
          onClick: (e) => {
            e.stopPropagation();
            onStart();
          },
          children: "\uC0C1\uB2F4 \uC2DC\uC791",
        }),
      }),
    ],
  });
export default CoachCard;
