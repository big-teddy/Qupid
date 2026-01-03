import { db, DbUser, supabase } from "../../../config/supabase.js";
import { UserProfile } from "@qupid/core";

export class UserService {
  /**
   * 사용자 프로필 조회
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const dbUser = await db.getUser(userId);

    if (!dbUser) {
      return null;
    }

    return this.mapDbUserToProfile(dbUser);
  }

  /**
   * 사용자 프로필 생성
   */
  async createUserProfile(
    profile: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    // partner_gender가 없으면 user_gender의 반대로 자동 설정
    const userGender = profile.user_gender;
    let partnerGender = profile.partner_gender;

    if (!partnerGender && userGender) {
      // 반대 성별로 기본 설정 (남성 → 여성, 여성 → 남성)
      partnerGender = userGender === "male" ? "female" : "male";
    }

    const dbUser = await db.createUser({
      id: profile.id,
      name: profile.name || "",
      user_gender: userGender,
      partner_gender: partnerGender,
      experience: profile.experience || "",
      confidence: Number(profile.confidence) || 3,
      difficulty: Number(profile.difficulty) || 2,
      interests: profile.interests || [],
      is_tutorial_completed: profile.isTutorialCompleted || false,
    });

    if (!dbUser) {
      return null;
    }

    return this.mapDbUserToProfile(dbUser);
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    // Filter out undefined values to ensure safe partial updates
    const cleanedUpdates = Object.fromEntries(
      Object.entries({
        name: updates.name,
        user_gender: updates.user_gender,
        partner_gender: updates.partner_gender,
        experience: updates.experience,
        confidence: updates.confidence,
        difficulty: updates.difficulty,
        interests: updates.interests,
        is_tutorial_completed: updates.isTutorialCompleted,
        updated_at: new Date().toISOString(),
      }).filter(([_, v]) => v !== undefined)
    );

    const { data, error } = await supabase
      .from("users")
      .update(cleanedUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapDbUserToProfile(data as DbUser);
  }

  /**
   * 튜토리얼 완료 상태 업데이트
   */
  async completeTutorial(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({
        is_tutorial_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return !error;
  }

  /**
   * 즐겨찾기 토글
   */
  async toggleFavorite(userId: string, personaId: string): Promise<boolean> {
    return await db.toggleFavorite(userId, personaId);
  }

  /**
   * 즐겨찾기 목록 조회
   */
  async getFavorites(userId: string): Promise<string[]> {
    const favorites = await db.getFavorites(userId);
    return favorites.map((f) => f.persona_id);
  }

  /**
   * DB User를 UserProfile로 매핑
   */
  private mapDbUserToProfile(dbUser: DbUser): UserProfile {
    return {
      id: dbUser.id,
      name: dbUser.name,
      user_gender: dbUser.user_gender as "male" | "female",
      partner_gender: dbUser.partner_gender as "male" | "female" | undefined,
      experience: dbUser.experience,
      confidence: Number(dbUser.confidence) || 3,
      difficulty: Number(dbUser.difficulty) || 2,
      interests: dbUser.interests,
      isTutorialCompleted: dbUser.is_tutorial_completed,
      created_at: dbUser.created_at,
    };
  }
}
