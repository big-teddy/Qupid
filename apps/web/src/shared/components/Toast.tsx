import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { setToastRef } from "../lib/toast";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const iconProps = { className: "w-5 h-5", strokeWidth: 2 };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="w-5 h-5 text-green-500" />;
    case "error":
      return <XCircle {...iconProps} className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertCircle {...iconProps} className="w-5 h-5 text-orange-500" />;
    case "info":
      return <Info {...iconProps} className="w-5 h-5 text-blue-500" />;
  }
};

const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
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

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        ${bgColors[toast.type]}
        ${isExiting ? "toast-exit" : "toast-enter"}
      `}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm font-medium text-gray-800">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Connect to global toast ref
  useEffect(() => {
    setToastRef({ showToast });
    return () => setToastRef(null);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={hideToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Utility functions for quick access
export const toast = {
  success: (message: string, duration?: number) => {
    // This needs to be called within a component that has access to ToastContext
    console.log("[Toast] Success:", message);
  },
  error: (message: string, duration?: number) => {
    console.log("[Toast] Error:", message);
  },
  warning: (message: string, duration?: number) => {
    console.log("[Toast] Warning:", message);
  },
  info: (message: string, duration?: number) => {
    console.log("[Toast] Info:", message);
  },
};

export default ToastProvider;
