import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const TypingIndicator = () =>
  _jsxs("div", {
    className: "flex items-center justify-center space-x-1 p-2",
    children: [
      _jsx("div", {
        className:
          "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-gray-500",
      }),
      _jsx("div", {
        className:
          "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-gray-500",
      }),
      _jsx("div", {
        className: "w-2 h-2 rounded-full animate-bounce bg-gray-500",
      }),
    ],
  });
