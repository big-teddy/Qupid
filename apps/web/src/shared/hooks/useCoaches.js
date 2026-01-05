import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { queryKeys } from "../keys/queryKeys";
export function useCoaches() {
    return useQuery({
        queryKey: queryKeys.coaching.coaches(),
        queryFn: async () => {
            const response = await api.get("/coaches");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
}
export function useCoach(id) {
    return useQuery({
        queryKey: queryKeys.coaching.coach(id),
        queryFn: async () => {
            const response = await api.get(`/coaches/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}
