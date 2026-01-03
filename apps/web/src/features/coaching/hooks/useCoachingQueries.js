import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api-client";
import { queryKeys } from "../../../shared/keys/queryKeys";
/**
 * 코칭 세션 생성
 */
export const useCreateCoachingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ coachId, userId }) => {
      const response = await api.post("/coaches/sessions", { coachId, userId });
      return response.data.sessionId;
    },
    onSuccess: (_, variables) => {
      // 세션 생성 성공 시 대시보드 갱신
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.coaching.dashboard(variables.userId),
        });
      }
    },
  });
};
/**
 * 코칭 메시지 전송
 */
export const useSendCoachingMessage = () => {
  return useMutation({
    mutationFn: async ({ sessionId, message }) => {
      const response = await api.post(
        `/coaches/sessions/${sessionId}/messages`,
        { message },
      );
      return response.data;
    },
  });
};
/**
 * 코칭 세션 분석
 */
export const useAnalyzeCoachingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, messages }) => {
      const response = await api.post(`/coaches/sessions/${sessionId}/end`, {
        messages,
      });
      return response.data;
    },
    onSuccess: () => {
      // 분석 완료 시 모든 대시보드 갱신 (userId를 모르므로 전체 혹은 상위 키 무효화)
      // 여기서는 queryKeys.coaching.all 같은게 있다면 좋겠지만, 일단 user-specific 키 패턴을 고려
      queryClient.invalidateQueries({
        queryKey: ["coaches", "dashboard"], // Broad invalidation approach
      });
    },
  });
};
/**
 * 코칭 대시보드 조회
 */
export const useCoachingDashboard = (userId = "test-user") => {
  return useQuery({
    queryKey: queryKeys.coaching.dashboard(userId),
    queryFn: async () => {
      const response = await api.get(`/coaches/dashboard?userId=${userId}`);
      return response.data;
    },
  });
};
/**
 * 목표 상태 업데이트
 */
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ goalId, status, userId }) => {
      const response = await api.patch(
        `/coaches/goals/${goalId}?userId=${userId}`,
        { status },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coaching.dashboard(variables.userId),
      });
    },
  });
};
/**
 * 목표 생성
 */
export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, userId }) => {
      const response = await api.post(`/coaches/goals?userId=${userId}`, {
        title,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coaching.dashboard(variables.userId),
      });
    },
  });
};
/**
 * 스타일링 조언 받기
 */
export const useStylingAdvice = () => {
  return useMutation({
    mutationFn: async ({ prompt }) => {
      const response = await api.post("/styling/advice", { prompt });
      return response.data;
    },
  });
};
