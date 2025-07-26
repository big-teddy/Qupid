import { supabase } from './supabaseClient';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content?: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

// 알림 생성
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  content?: string,
  data?: any
): Promise<Notification> {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      type,
      title,
      content,
      data
    }])
    .select()
    .single();

  if (error) throw error;
  return notification;
}

// 사용자의 알림 목록 조회
export async function getUserNotifications(
  userId: string, 
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// 알림 읽음 처리
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

// 모든 알림 읽음 처리
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

// 알림 삭제
export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
}

// 읽지 않은 알림 개수 조회
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
}

// 알림 통계 조회
export async function getNotificationStats(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('type, is_read, created_at')
    .eq('user_id', userId);

  if (error) throw error;

  const totalNotifications = data?.length || 0;
  const unreadNotifications = data?.filter(n => !n.is_read)?.length || 0;
  const readNotifications = totalNotifications - unreadNotifications;

  // 타입별 통계
  const typeStats: Record<string, number> = {};
  data?.forEach(notification => {
    typeStats[notification.type] = (typeStats[notification.type] || 0) + 1;
  });

  return {
    total: totalNotifications,
    unread: unreadNotifications,
    read: readNotifications,
    typeStats
  };
}

// 특정 타입의 알림 조회
export async function getNotificationsByType(
  userId: string, 
  type: string, 
  limit: number = 20
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 알림 템플릿들
export const NOTIFICATION_TEMPLATES = {
  // 대화 완료 알림
  conversation_completed: (score: number) => ({
    type: 'conversation_completed',
    title: '대화 완료!',
    content: `대화 분석 결과를 확인해보세요. 점수: ${score}점`,
    data: { score }
  }),

  // 배지 획득 알림
  badge_earned: (badgeName: string) => ({
    type: 'badge_earned',
    title: '새로운 배지 획득!',
    content: `축하합니다! "${badgeName}" 배지를 획득했습니다.`,
    data: { badgeName }
  }),

  // 목표 달성 알림
  goal_achieved: (goalTitle: string) => ({
    type: 'goal_achieved',
    title: '목표 달성!',
    content: `"${goalTitle}" 목표를 달성했습니다!`,
    data: { goalTitle }
  }),

  // 일일 알림
  daily_reminder: () => ({
    type: 'daily_reminder',
    title: '오늘의 연습 시간!',
    content: '오늘도 대화 실력을 키워보세요.',
    data: {}
  }),

  // 주간 성과 알림
  weekly_summary: (score: number, improvement: number) => ({
    type: 'weekly_summary',
    title: '주간 성과 요약',
    content: `이번 주 평균 점수: ${score}점 (전주 대비 ${improvement > 0 ? '+' : ''}${improvement}점)`,
    data: { score, improvement }
  }),

  // 새로운 페르소나 알림
  new_persona: (personaName: string) => ({
    type: 'new_persona',
    title: '새로운 페르소나 등장!',
    content: `"${personaName}"와 대화해보세요.`,
    data: { personaName }
  })
};

// 자동 알림 생성 헬퍼 함수들
export async function createConversationCompletedNotification(userId: string, score: number, conversationId: string) {
  const template = NOTIFICATION_TEMPLATES.conversation_completed(score);
  return await createNotification(
    userId,
    template.type,
    template.title,
    template.content,
    { ...template.data, conversationId }
  );
}

export async function createBadgeEarnedNotification(userId: string, badgeName: string) {
  const template = NOTIFICATION_TEMPLATES.badge_earned(badgeName);
  return await createNotification(
    userId,
    template.type,
    template.title,
    template.content,
    template.data
  );
}

export async function createGoalAchievedNotification(userId: string, goalTitle: string) {
  const template = NOTIFICATION_TEMPLATES.goal_achieved(goalTitle);
  return await createNotification(
    userId,
    template.type,
    template.title,
    template.content,
    template.data
  );
}

export async function createDailyReminderNotification(userId: string) {
  const template = NOTIFICATION_TEMPLATES.daily_reminder();
  return await createNotification(
    userId,
    template.type,
    template.title,
    template.content,
    template.data
  );
} 