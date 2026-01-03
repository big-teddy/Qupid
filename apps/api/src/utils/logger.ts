/**
 * Structured Logger
 *
 * JSON 형식의 구조화된 로깅 유틸리티
 * - 로그 레벨 지원 (debug, info, warn, error)
 * - 타임스탬프 자동 추가
 * - 컨텍스트 정보 포함
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    service: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private serviceName: string;
    private minLevel: LogLevel;

    constructor(serviceName: string = "qupid-api") {
        this.serviceName = serviceName;
        this.minLevel = (process.env.LOG_LEVEL as LogLevel) || "info";
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
    }

    private formatEntry(
        level: LogLevel,
        message: string,
        context?: LogContext,
    ): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(context && Object.keys(context).length > 0 ? { context } : {}),
            service: this.serviceName,
        };
    }

    private output(entry: LogEntry): void {
        const json = JSON.stringify(entry);

        switch (entry.level) {
            case "error":
                console.error(json);
                break;
            case "warn":
                console.warn(json);
                break;
            default:
                console.log(json);
        }
    }

    debug(message: string, context?: LogContext): void {
        if (this.shouldLog("debug")) {
            this.output(this.formatEntry("debug", message, context));
        }
    }

    info(message: string, context?: LogContext): void {
        if (this.shouldLog("info")) {
            this.output(this.formatEntry("info", message, context));
        }
    }

    warn(message: string, context?: LogContext): void {
        if (this.shouldLog("warn")) {
            this.output(this.formatEntry("warn", message, context));
        }
    }

    error(message: string, context?: LogContext): void {
        if (this.shouldLog("error")) {
            this.output(this.formatEntry("error", message, context));
        }
    }

    /**
     * 자식 로거 생성 (특정 모듈용)
     */
    child(moduleName: string): Logger {
        const childLogger = new Logger(`${this.serviceName}:${moduleName}`);
        childLogger.minLevel = this.minLevel;
        return childLogger;
    }
}

// 싱글톤 인스턴스
export const logger = new Logger();

// 모듈별 로거 생성 헬퍼
export function createLogger(moduleName: string): Logger {
    return logger.child(moduleName);
}
