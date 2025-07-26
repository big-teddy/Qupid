import { Achievement, UserProfile, ConversationAnalysis } from '../types';
import { ACHIEVEMENTS } from '../constants';

// 성취 체크 함수들
export const checkFirstConversation = (userProfile: UserProfile): Achievement | null => {
  if (userProfile.totalConversations >= 1) {
    return ACHIEVEMENTS.find(a => a.id === 'first_conversation') || null;
  }
  return null;
};

export const checkConversationMaster = (conversationDuration: number): Achievement | null => {
  if (conversationDuration >= 600) { // 10분 = 600초
    return ACHIEVEMENTS.find(a => a.id === 'conversation_master') || null;
  }
  return null;
};

export const checkEmpathyMaster = (analysis: ConversationAnalysis): Achievement | null => {
  if (analysis.empathy.score >= 90) {
    return ACHIEVEMENTS.find(a => a.id === 'empathy_master') || null;
  }
  return null;
};

export const checkCuriosityExpert = (analysis: ConversationAnalysis): Achievement | null => {
  if (analysis.curiosity.score >= 90) {
    return ACHIEVEMENTS.find(a => a.id === 'curiosity_expert') || null;
  }
  return null;
};

export const checkFriendlinessChampion = (analysis: ConversationAnalysis): Achievement | null => {
  if (analysis.friendliness.score >= 90) {
    return ACHIEVEMENTS.find(a => a.id === 'friendliness_champion') || null;
  }
  return null;
};

export const checkStreakAchievements = (streakDays: number): Achievement[] => {
  const achievements: Achievement[] = [];
  
  if (streakDays >= 3) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_3');
    if (achievement) achievements.push(achievement);
  }
  
  if (streakDays >= 7) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_7');
    if (achievement) achievements.push(achievement);
  }
  
  if (streakDays >= 30) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_30');
    if (achievement) achievements.push(achievement);
  }
  
  return achievements;
};

export const checkCustomPersona = (hasCustomPersona: boolean): Achievement | null => {
  if (hasCustomPersona) {
    return ACHIEVEMENTS.find(a => a.id === 'custom_persona') || null;
  }
  return null;
};

export const checkPerfectScore = (analysis: ConversationAnalysis): Achievement | null => {
  if (analysis.totalScore >= 100) {
    return ACHIEVEMENTS.find(a => a.id === 'perfect_score') || null;
  }
  return null;
};

// 경험치 계산 함수
export const calculateExperiencePoints = (analysis: ConversationAnalysis, conversationDuration: number): number => {
  let baseXP = 50; // 기본 경험치
  
  // 점수에 따른 보너스
  if (analysis.totalScore >= 90) baseXP += 30;
  else if (analysis.totalScore >= 80) baseXP += 20;
  else if (analysis.totalScore >= 70) baseXP += 10;
  
  // 대화 시간에 따른 보너스
  if (conversationDuration >= 600) baseXP += 20; // 10분 이상
  else if (conversationDuration >= 300) baseXP += 10; // 5분 이상
  
  // 첫 대화 보너스
  // 이 부분은 실제로는 사용자 프로필에서 첫 대화 여부를 확인해야 함
  
  return baseXP;
};

// 레벨 계산 함수
export const calculateLevel = (experiencePoints: number): number => {
  return Math.floor(experiencePoints / 1000) + 1;
};

// 레벨별 칭호
export const getLevelTitle = (level: number): string => {
  if (level >= 10) return '연애 마스터';
  if (level >= 8) return '연애 고수';
  if (level >= 6) return '연애 중급자';
  if (level >= 4) return '연애 초급자';
  if (level >= 2) return '연애 입문자';
  return '연애 초보자';
};

// 주간 목표 진행도 체크
export const checkWeeklyGoals = (
  weeklyGoals: any[],
  currentConversations: number,
  currentScore: number,
  currentTime: number
): any[] => {
  return weeklyGoals.map(goal => {
    let current = 0;
    
    switch (goal.id) {
      case 'conversations_5':
        current = currentConversations;
        break;
      case 'score_80':
        current = currentScore;
        break;
      case 'time_120':
        current = currentTime;
        break;
    }
    
    return {
      ...goal,
      current,
      completed: current >= goal.target
    };
  });
};

// 연속 사용 일수 계산
export const calculateStreakDays = (lastActiveDate: string): number => {
  const today = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffTime = Math.abs(today.getTime() - lastActive.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 연속 사용이 끊어진 경우 0 반환
  if (diffDays > 1) return 0;
  
  // 실제로는 사용자 프로필에서 연속 일수를 가져와야 함
  return 5; // 임시 값
}; 