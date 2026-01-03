import { db, supabase } from "../../../config/supabase.js";
import { AICoach, AI_COACHES } from "@qupid/core";

export class CoachService {
  /**
   * 모든 코치 조회
   */
  async getAllCoaches(): Promise<AICoach[]> {
    try {
      const dbCoaches = await db.getCoaches();

      // DB에 데이터가 있으면 DB 데이터 사용
      if (dbCoaches && dbCoaches.length > 0) {
        return dbCoaches.map((c) => ({
          id: c.id,
          name: c.name,
          specialty: c.specialty,
          tagline: c.tagline,
          intro: c.bio,
          avatar: c.avatar,
          system_instruction: `You are ${c.name}, an AI coach specializing in ${c.specialty}. ${c.bio}`,
        }));
      }

      // DB가 비어있으면 constants 데이터 사용
      return AI_COACHES;
    } catch (error) {
      // DB 오류 시에도 constants 데이터 반환
      console.warn("DB error, using fallback constants:", error);
      return AI_COACHES;
    }
  }

  /**
   * 특정 코치 조회
   */
  async getCoachById(id: string): Promise<AICoach | null> {
    const coaches = await this.getAllCoaches();
    return coaches.find((c) => c.id === id) || null;
  }

  /**
   * 전문 분야로 코치 필터링
   */
  async getCoachesBySpecialty(specialty: string): Promise<AICoach[]> {
    const allCoaches = await this.getAllCoaches();
    return allCoaches.filter((c) =>
      c.specialty.toLowerCase().includes(specialty.toLowerCase()),
    );
  }

  /**
   * 사용자 코칭 대시보드 데이터 조회
   */
  async getUserDashboard(userId: string) {
    // 1. Growth Stats
    const { data: stats } = await supabase
      .from('user_growth_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 2. Active Goals
    const { data: goals } = await supabase
      .from('coaching_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    return {
      stats: stats || {
        friendliness_exp: 0,
        curiosity_exp: 0,
        empathy_exp: 0,
        total_level: 1
      },
      goals: goals || []
    };
  }

  /**
   * 목표 생성
   */
  async createGoal(userId: string, title: string, description?: string) {
    const { data, error } = await supabase
      .from('coaching_goals')
      .insert({ user_id: userId, title, description, status: 'active' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * 목표 상태 업데이트
   */
  async updateGoalStatus(userId: string, goalId: string, status: string) {
    const { data, error } = await supabase
      .from('coaching_goals')
      .update({ status })
      .eq('id', goalId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
