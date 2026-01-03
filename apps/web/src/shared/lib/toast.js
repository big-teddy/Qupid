import Logger from "../utils/logger";
// Global reference for toast notifications from hooks/services
let toastRef = null;
/**
 * Set the toast ref from ToastProvider
 */
export const setToastRef = (ref) => {
  toastRef = ref;
};
/**
 * Show a toast notification from anywhere in the application
 */
export const showGlobalToast = (message, type = "info", duration) => {
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
