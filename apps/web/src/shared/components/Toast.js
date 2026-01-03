import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { setToastRef } from "../lib/toast";
const ToastContext = createContext(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
const ToastIcon = ({ type }) => {
  const iconProps = { className: "w-5 h-5", strokeWidth: 2 };
  switch (type) {
    case "success":
      return _jsx(CheckCircle, {
        ...iconProps,
        className: "w-5 h-5 text-green-500",
      });
    case "error":
      return _jsx(XCircle, { ...iconProps, className: "w-5 h-5 text-red-500" });
    case "warning":
      return _jsx(AlertCircle, {
        ...iconProps,
        className: "w-5 h-5 text-orange-500",
      });
    case "info":
      return _jsx(Info, { ...iconProps, className: "w-5 h-5 text-blue-500" });
  }
};
const ToastItem = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => {
    if (toast.duration) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 200);
      const removeTimer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast.id, toast.duration, onClose]);
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  };
  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-orange-50 border-orange-200",
    info: "bg-blue-50 border-blue-200",
  };
  return _jsxs("div", {
    className: `
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        ${bgColors[toast.type]}
        ${isExiting ? "toast-exit" : "toast-enter"}
      `,
    children: [
      _jsx(ToastIcon, { type: toast.type }),
      _jsx("p", {
        className: "flex-1 text-sm font-medium text-gray-800",
        children: toast.message,
      }),
      _jsx("button", {
        onClick: handleClose,
        className: "p-1 rounded-full hover:bg-black/5 transition-colors",
        children: _jsx(X, { className: "w-4 h-4 text-gray-500" }),
      }),
    ],
  });
};
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);
  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  // Connect to global toast ref
  useEffect(() => {
    setToastRef({ showToast });
    return () => setToastRef(null);
  }, [showToast]);
  return _jsxs(ToastContext.Provider, {
    value: { showToast, hideToast },
    children: [
      children,
      _jsx("div", {
        className:
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4",
        children: toasts.map((toast) =>
          _jsx(ToastItem, { toast: toast, onClose: hideToast }, toast.id),
        ),
      }),
    ],
  });
};
// Utility functions for quick access
export const toast = {
  success: (message, duration) => {
    // This needs to be called within a component that has access to ToastContext
    console.log("[Toast] Success:", message);
  },
  error: (message, duration) => {
    console.log("[Toast] Error:", message);
  },
  warning: (message, duration) => {
    console.log("[Toast] Warning:", message);
  },
  info: (message, duration) => {
    console.log("[Toast] Info:", message);
  },
};
export default ToastProvider;
