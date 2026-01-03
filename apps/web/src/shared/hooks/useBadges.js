import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api-client";
export function useBadges() {
    return useQuery({
        queryKey: ["badges"],
        queryFn: async () => {
            const response = await api.get("/badges");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
}
export function useUserBadges(userId) {
    return useQuery({
        queryKey: ["userBadges", userId],
        queryFn: async () => {
            const response = await api.get(`/users/${userId}/badges`);
            return response.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
export function useAwardBadge() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, badgeId, }) => {
            const response = await api.post(`/users/${userId}/badges`, {
                badgeId,
            });
            return response;
        },
        onSuccess: (_, variables) => {
            // Invalidate user badges cache to refetch
            queryClient.invalidateQueries({
                queryKey: ["userBadges", variables.userId],
            });
        },
    });
}
