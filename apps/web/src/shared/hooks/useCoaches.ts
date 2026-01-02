import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { AICoach } from "@qupid/core";
import { queryKeys } from "../keys/queryKeys";

interface CoachesResponse {
  success: boolean;
  data: AICoach[];
}

export function useCoaches() {
  return useQuery<AICoach[]>({
    queryKey: queryKeys.coaching.coaches(),
    queryFn: async () => {
      const response = await api.get<CoachesResponse>("/coaches");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

export function useCoach(id: string) {
  return useQuery<AICoach>({
    queryKey: queryKeys.coaching.coach(id),
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: AICoach }>(
        `/coaches/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
  });
}
