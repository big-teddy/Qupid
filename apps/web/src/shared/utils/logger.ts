type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private static isDev = import.meta.env.DEV;

  static debug(message: string, ...args: any[]) {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    if (this.isDev) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }
}

export default Logger;
