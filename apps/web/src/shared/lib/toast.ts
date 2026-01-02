import Logger from "../utils/logger";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastRef {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

// Global reference for toast notifications from hooks/services
let toastRef: ToastRef | null = null;

/**
 * Set the toast ref from ToastProvider
 */
export const setToastRef = (ref: ToastRef | null) => {
    toastRef = ref;
};

/**
 * Show a toast notification from anywhere in the application
 */
export const showGlobalToast = (
    message: string,
    type: ToastType = "info",
    duration?: number,
) => {
    if (toastRef) {
        toastRef.showToast(message, type, duration);
    } else {
        // Fallback to Logger if toast is not available
        switch (type) {
            case "error":
                Logger.error(`[Toast] ${message}`);
                break;
            case "warning":
                Logger.warn(`[Toast] ${message}`);
                break;
            default:
                Logger.info(`[Toast] ${message}`);
        }
    }
};

export default showGlobalToast;
