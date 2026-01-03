import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import Logger from "../utils/logger";
class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    Logger.error("ErrorBoundary caught an error:", error, errorInfo);
    // 사용자 정의 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  handleReload = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // 기본 에러 UI
      return _jsx("div", {
        className:
          "flex items-center justify-center min-h-screen bg-gray-50 px-4",
        children: _jsx("div", {
          className: "max-w-md w-full bg-white rounded-lg shadow-lg p-8",
          children: _jsxs("div", {
            className: "text-center",
            children: [
              _jsx("div", {
                className:
                  "mx-auto w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center",
                children: _jsx("svg", {
                  className: "w-8 h-8 text-red-600",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: _jsx("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                  }),
                }),
              }),
              _jsx("h2", {
                className: "text-2xl font-bold text-gray-800 mb-2",
                children:
                  "\uC557! \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694",
              }),
              _jsx("p", {
                className: "text-gray-600 mb-6",
                children:
                  "\uC608\uC0C1\uCE58 \uBABB\uD55C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
              }),
              process.env.NODE_ENV === "development" &&
                this.state.error &&
                _jsx("div", {
                  className: "mb-6 p-4 bg-gray-100 rounded-lg text-left",
                  children: _jsx("p", {
                    className: "text-sm font-mono text-gray-700 break-words",
                    children: this.state.error.message,
                  }),
                }),
              _jsxs("div", {
                className: "flex gap-3",
                children: [
                  _jsx("button", {
                    onClick: this.handleReset,
                    className:
                      "flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors",
                    children: "\uB2E4\uC2DC \uC2DC\uB3C4",
                  }),
                  _jsx("button", {
                    onClick: this.handleReload,
                    className:
                      "flex-1 px-6 py-3 bg-[#F093B0] text-white rounded-lg font-medium hover:bg-[#E085A3] transition-colors",
                    children: "\uC0C8\uB85C\uACE0\uCE68",
                  }),
                ],
              }),
            ],
          }),
        }),
      });
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
