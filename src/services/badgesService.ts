import { supabase } from './supabaseClient';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: '대화' | '성장' | '특별';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  criteria: any;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  acquired_at: string;
  progress?: any;
  badge?: Badge;
}

// 사용자의 배지 목록 조회
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badges (
        id,
        name,
        description,
        icon,
        category,
        rarity,
        criteria
      )
    `)
    .eq('user_id', userId)
    .order('acquired_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 배지 획득
export async function earnBadge(userId: string, badgeId: string, progress?: any): Promise<UserBadge> {
  const { data, error } = await supabase
    .from('user_badges')
    .insert([{
      user_id: userId,
      badge_id: badgeId,
      progress
    }])
    .select(`
      *,
      badges (
        id,
        name,
        description,
        icon,
        category,
        rarity,
        criteria
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

// 특정 배지를 이미 획득했는지 확인
export async function hasBadge(userId: string, badgeId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// 배지 진행 상황 업데이트
export async function updateBadgeProgress(userId: string, badgeId: string, progress: any): Promise<void> {
  const { error } = await supabase
    .from('user_badges')
    .update({ progress })
    .eq('user_id', userId)
    .eq('badge_id', badgeId);

  if (error) throw error;
}

// 모든 배지 목록 조회 (관리자용)
export async function getAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('category', { ascending: true })
    .order('rarity', { ascending: true });

  if (error) throw error;
  return data || [];
}

// 배지 획득 조건 확인 및 자동 배지 부여
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const awardedBadges: string[] = [];
  
  // 사용자 통계 조회
  const { data: conversations } = await supabase
    .from('conversations')
    .select('total_score, empathy_score, curiosity_score, friendliness_score, created_at')
    .eq('user_id', userId);

  const { data: customPersonas } = await supabase
    .from('personas')
    .select('id')
    .eq('user_id', userId)
    .eq('custom', true);

  const { data: stylingRequests } = await supabase
    .from('styling_requests')
    .select('id')
    .eq('user_id', userId);

  // 첫 대화 배지
  if (conversations && conversations.length > 0) {
    const hasFirstConversationBadge = await hasBadge(userId, 'first_conversation_badge_id');
    if (!hasFirstConversationBadge) {
      // 실제 배지 ID로 교체 필요
      // await earnBadge(userId, 'first_conversation_badge_id');
      awardedBadges.push('첫 대화');
    }
  }

  // 공감의 달인 배지
  const empathyScores = conversations?.map(c => c.empathy_score).filter(s => s >= 90) || [];
  if (empathyScores.length > 0) {
    const hasEmpathyBadge = await hasBadge(userId, 'empathy_master_badge_id');
    if (!hasEmpathyBadge) {
      // await earnBadge(userId, 'empathy_master_badge_id');
      awardedBadges.push('공감의 달인');
    }
  }

  // 맞춤 페르소나 마스터 배지
  if (customPersonas && customPersonas.length >= 5) {
    const hasCustomPersonaBadge = await hasBadge(userId, 'custom_persona_master_badge_id');
    if (!hasCustomPersonaBadge) {
      // await earnBadge(userId, 'custom_persona_master_badge_id');
      awardedBadges.push('맞춤 페르소나 마스터');
    }
  }

  // 스타일링 전문가 배지
  if (stylingRequests && stylingRequests.length >= 10) {
    const hasStylingBadge = await hasBadge(userId, 'styling_expert_badge_id');
    if (!hasStylingBadge) {
      // await earnBadge(userId, 'styling_expert_badge_id');
      awardedBadges.push('스타일링 전문가');
    }
  }

  return awardedBadges;
} 