/**
 * Rate Limiter Middleware
 *
 * IP 기반 요청 제한으로 API 남용 방지
 * - 윈도우: 1분
 * - 제한: 100 요청/분
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

// 메모리 기반 저장소 (운영 환경에서는 Redis 사용 권장)
const rateLimitStore = new Map<string, RateLimitRecord>();

// 설정
const WINDOW_MS = 60 * 1000; // 1분
const MAX_REQUESTS = 100; // 분당 100 요청

// 주기적 정리 (메모리 누수 방지)
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (record.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, WINDOW_MS);

import { Request, Response, NextFunction } from "express";

export function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let record = rateLimitStore.get(clientIp);

    if (!record || record.resetTime < now) {
        // 새 윈도우 시작
        record = {
            count: 1,
            resetTime: now + WINDOW_MS,
        };
        rateLimitStore.set(clientIp, record);
        next();
        return;
    }

    if (record.count >= MAX_REQUESTS) {
        // 제한 초과
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.set("Retry-After", String(retryAfter));
        res.status(429).json({
            error: "Too Many Requests",
            message: `요청 한도를 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
            retryAfter,
        });
        return;
    }

    // 카운트 증가
    record.count++;
    next();
}

/**
 * 특정 엔드포인트에 대한 커스텀 Rate Limiter 생성
 */
export function createRateLimiter(options: {
    windowMs?: number;
    maxRequests?: number;
}) {
    const windowMs = options.windowMs || WINDOW_MS;
    const maxRequests = options.maxRequests || MAX_REQUESTS;
    const store = new Map<string, RateLimitRecord>();

    return (req: Request, res: Response, next: NextFunction): void => {
        const clientIp = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();

        let record = store.get(clientIp);

        if (!record || record.resetTime < now) {
            record = { count: 1, resetTime: now + windowMs };
            store.set(clientIp, record);
            next();
            return;
        }

        if (record.count >= maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.set("Retry-After", String(retryAfter));
            res.status(429).json({
                error: "Too Many Requests",
                message: `요청 한도를 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
                retryAfter,
            });
            return;
        }

        record.count++;
        next();
    };
}
