import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon } from "@qupid/ui";
/**
 * 체크 가능한 선택 카드 컴포넌트
 */
export const CheckableCard = ({
  icon,
  title,
  subtitle,
  checked,
  onClick,
  "data-testid": dataTestId,
}) =>
  _jsxs("button", {
    onClick: onClick,
    "data-testid": dataTestId,
    className: `w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left relative flex items-center gap-4 ${
      checked
        ? "border-[#0AC5A8] bg-[#E6F7F5]"
        : "border-[#E5E8EB] bg-white hover:border-[#0AC5A8]/50"
    }`,
    children: [
      icon && _jsx("span", { className: "text-4xl", children: icon }),
      _jsxs("div", {
        className: "flex-1",
        children: [
          _jsx("div", {
            className: "font-bold text-lg text-[#191F28]",
            children: title,
          }),
          subtitle &&
            _jsx("div", {
              className: "text-sm text-[#8B95A1] mt-0.5",
              children: subtitle,
            }),
        ],
      }),
      checked &&
        _jsx("div", {
          className:
            "w-6 h-6 bg-[#0AC5A8] rounded-full flex items-center justify-center",
          children: _jsx(CheckIcon, { className: "w-4 h-4 text-white" }),
        }),
    ],
  });
export default CheckableCard;
