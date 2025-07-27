// Supabase 클라이언트
export { supabase } from './supabaseClient';

// 페르소나 서비스
export * from './personaService';

// 대화 서비스
export * from './conversationService';

// 즐겨찾기 서비스 - 동적 import로 변경
// export * from './favoritesService';

// 배지 서비스
export * from './badgesService';

// 성과 관리 서비스
export * from './performanceService';

// 설정 관리 서비스
export * from './settingsService';

// 스타일링 서비스
export * from './stylingService';

// 알림 서비스
export * from './notificationsService';

// 통합 서비스 헬퍼 함수들
export const DatabaseService = {
  // 사용자 초기화
  async initializeUser(userId: string) {
    const { initializeUserSettings } = await import('./settingsService');
    await initializeUserSettings(userId);
  },

  // 대화 완료 시 자동 처리
  async handleConversationComplete(
    userId: string, 
    conversationId: string, 
    analysis: any
  ) {
    const [
      { endConversation },
      { createConversationCompletedNotification },
      { checkAndAwardBadges },
      { calculateAndSaveWeeklyPerformance }
    ] = await Promise.all([
      import('./conversationService'),
      import('./notificationsService'),
      import('./badgesService'),
      import('./performanceService')
    ]);

    // 대화 완료 처리
    await endConversation(conversationId, analysis);
    
    // 알림 생성
    await createConversationCompletedNotification(userId, analysis.totalScore, conversationId);
    
    // 배지 확인 및 부여
    const awardedBadges = await checkAndAwardBadges(userId);
    
    // 성과 기록 업데이트
    const currentWeekStart = getWeekStartDate(new Date());
    await calculateAndSaveWeeklyPerformance(userId, currentWeekStart);

    return { awardedBadges };
  },

  // 사용자 대시보드 데이터 조회
  async getDashboardData(userId: string) {
    const [
      { getDashboardPerformance },
      { getUserNotifications },
      { getUnreadNotificationCount },
      { getUserFavorites },
      { getUserBadges }
    ] = await Promise.all([
      import('./performanceService'),
      import('./notificationsService'),
      import('./notificationsService'),
      import('./favoritesService'),
      import('./badgesService')
    ]);

    const [performance, notifications, unreadCount, favorites, badges] = await Promise.all([
      getDashboardPerformance(userId),
      getUserNotifications(userId, 5),
      getUnreadNotificationCount(userId),
      getUserFavorites(userId),
      getUserBadges(userId)
    ]);

    return {
      performance,
      notifications,
      unreadCount,
      favorites,
      badges
    };
  }
};

// 주 시작일 계산 헬퍼 함수
function getWeekStartDate(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
} 