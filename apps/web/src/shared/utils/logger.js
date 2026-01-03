class Logger {
    static isDev = import.meta.env.DEV;
    static debug(message, ...args) {
        if (this.isDev) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
    static info(message, ...args) {
        if (this.isDev) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }
    static warn(message, ...args) {
        console.warn(`[WARN] ${message}`, ...args);
    }
    static error(message, ...args) {
        console.error(`[ERROR] ${message}`, ...args);
    }
}
export default Logger;
