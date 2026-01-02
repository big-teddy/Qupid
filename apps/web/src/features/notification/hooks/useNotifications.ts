import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api-client";
import type { Notification } from "@qupid/core";

export interface NotificationSettings {
  practiceReminder: boolean;
  achievementAlerts: boolean;
  coachingTips: boolean;
  systemNotices: boolean;
  reminderTime?: string;
}

interface NotificationResponse<T> {
  ok: boolean;
  data: T;
}

// 알림 목록 조회
export const useNotifications = (userId: string, unreadOnly = false) => {
  return useQuery({
    queryKey: ["notifications", userId, unreadOnly],
    queryFn: async () => {
      const response = await api.get<NotificationResponse<Notification[]>>(
        `/notifications/${userId}?unreadOnly=${unreadOnly}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

// 읽지 않은 알림 개수
export const useUnreadCount = (userId: string) => {
  return useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: async () => {
      const response = await api.get<NotificationResponse<{ count: number }>>(
        `/notifications/${userId}/unread-count`,
      );
      return response.data.count;
    },
    enabled: !!userId,
    refetchInterval: 30000, // 30초마다 자동 새로고침
  });
};

// 알림 읽음 처리
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 모든 알림 읽음 처리
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.put(`/notifications/${userId}/read-all`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 알림 삭제
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 알림 설정 조회
export const useNotificationSettings = (userId: string) => {
  return useQuery({
    queryKey: ["notification-settings", userId],
    queryFn: async () => {
      const response = await api.get<NotificationResponse<NotificationSettings>>(
        `/notifications/${userId}/settings`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

// 알림 설정 업데이트
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      settings,
    }: {
      userId: string;
      settings: Partial<NotificationSettings>;
    }) => {
      await api.put(`/notifications/${userId}/settings`, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
  });
};

// 테스트 알림 발송
export const useSendTestNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, type }: { userId: string; type?: string }) => {
      await api.post("/notifications/test", { userId, type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
