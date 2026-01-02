import { useQuery } from "@tanstack/react-query";
import { PerformanceData } from "@qupid/core";
import { api } from "../lib/api-client";
import Logger from "../utils/logger";

interface PerformanceResponse {
  data: PerformanceData;
}

export function usePerformance(userId?: string) {
  return useQuery<PerformanceData>({
    queryKey: ["performance", userId || "guest"],
    queryFn: async () => {
      Logger.info("📊 usePerformance 호출됨, userId:", userId);

      // 🚀 userId가 없으면 게스트 ID 사용
      const actualUserId = userId || "guest-user";

      const response = await api.get<PerformanceResponse>(
        `/analytics/performance/${actualUserId}`,
      );

      Logger.info("✅ 성과 데이터 가져오기 성공:", response);
      return response.data;
    },
    enabled: true, // 🚀 항상 활성화 (게스트 모드 지원)
    refetchInterval: 60000, // 1분마다 자동 갱신
    staleTime: 30000, // 30초 동안 캐시 유지
    retry: 1, // 실패 시 1번만 재시도
  });
}

export function useWeeklyStats(userId?: string) {
  return useQuery({
    queryKey: ["weeklyStats", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await api.get<{ data: any }>(
        `/analytics/weekly/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useMonthlyStats(
  userId?: string,
  month?: number,
  year?: number,
) {
  return useQuery({
    queryKey: ["monthlyStats", userId, month, year],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const params = new URLSearchParams();
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const response = await api.get<{ data: any }>(
        `/analytics/monthly/${userId}?${params}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
}
