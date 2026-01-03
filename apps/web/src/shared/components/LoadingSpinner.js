import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LoadingSpinner = () =>
  _jsx("div", {
    className: "flex items-center justify-center h-screen",
    children: _jsxs("div", {
      className: "text-center",
      children: [
        _jsx("div", {
          className:
            "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4",
        }),
        _jsx("p", {
          className: "text-gray-600",
          children: "\uB85C\uB529 \uC911...",
        }),
      ],
    }),
  });
