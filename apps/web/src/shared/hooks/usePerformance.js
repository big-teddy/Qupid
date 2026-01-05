import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import Logger from "../utils/logger";
export function usePerformance(userId) {
    return useQuery({
        queryKey: ["performance", userId || "guest"],
        queryFn: async () => {
            Logger.info("📊 usePerformance 호출됨, userId:", userId);
            // 🚀 userId가 없으면 게스트 ID 사용
            const actualUserId = userId || "guest-user";
            const response = await api.get(`/analytics/performance/${actualUserId}`);
            Logger.info("✅ 성과 데이터 가져오기 성공:", response);
            return response.data;
        },
        enabled: true, // 🚀 항상 활성화 (게스트 모드 지원)
        refetchInterval: 60000, // 1분마다 자동 갱신
        staleTime: 30000, // 30초 동안 캐시 유지
        retry: 1, // 실패 시 1번만 재시도
    });
}
export function useWeeklyStats(userId) {
    return useQuery({
        queryKey: ["weeklyStats", userId],
        queryFn: async () => {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const response = await api.get(`/analytics/weekly/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });
}
export function useMonthlyStats(userId, month, year) {
    return useQuery({
        queryKey: ["monthlyStats", userId, month, year],
        queryFn: async () => {
            if (!userId) {
                throw new Error("User ID is required");
            }
            const params = new URLSearchParams();
            if (month)
                params.append("month", month.toString());
            if (year)
                params.append("year", year.toString());
            const response = await api.get(`/analytics/monthly/${userId}?${params}`);
            return response.data;
        },
        enabled: !!userId,
    });
}
