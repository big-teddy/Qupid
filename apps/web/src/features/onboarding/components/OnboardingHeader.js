import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftIcon } from "@qupid/ui";
import { ProgressIndicator } from "./ProgressIndicator";
/**
 * 온보딩 화면 공통 헤더
 */
export const OnboardingHeader = ({ onBack, progress, title, questionNumber }) =>
  _jsxs("div", {
    className: "px-4 py-3 bg-white",
    children: [
      _jsxs("div", {
        className: "flex items-center justify-between mb-4",
        children: [
          _jsx("button", {
            onClick: onBack,
            className:
              "p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors",
            children: _jsx(ArrowLeftIcon, {
              className: "w-6 h-6 text-[#4E5968]",
            }),
          }),
          _jsx(ProgressIndicator, { current: progress, total: 4 }),
          _jsx("div", { className: "w-10" }),
        ],
      }),
      _jsxs("div", {
        children: [
          questionNumber &&
            _jsxs("span", {
              className: "text-sm font-medium text-[#0AC5A8] mb-1 block",
              children: ["Q", questionNumber, "."],
            }),
          _jsx("h2", {
            className: "text-xl font-bold text-[#191F28] whitespace-pre-line",
            children: title,
          }),
        ],
      }),
    ],
  });
export default OnboardingHeader;
