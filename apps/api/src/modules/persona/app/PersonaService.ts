import { db } from "../../../config/supabase.js";
import { Persona } from "@qupid/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbPersona = any;

/**
 * DB 레코드를 Persona 도메인 객체로 변환
 */
function mapDbToPersona(p: DbPersona): Persona {
  return {
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender as "male" | "female",
    job: p.occupation,
    mbti: p.mbti,
    avatar: p.avatar,
    intro: p.bio,
    tags: p.tags,
    match_rate: p.match_rate,
    system_instruction: p.personality,
    personality_traits: p.tags,
    interests: p.interests.map((interest: string) => ({
      emoji: "✨",
      topic: interest,
      description: interest,
    })),
    conversation_preview: [],
  };
}

export class PersonaService {
  /**
   * 모든 페르소나 조회
   */
  async getAllPersonas(): Promise<Persona[]> {
    const dbPersonas = await db.getPersonas();
    return dbPersonas.map(mapDbToPersona);
  }

  /**
   * 특정 페르소나 조회
   */
  async getPersonaById(id: string): Promise<Persona | null> {
    const dbPersona = await db.getPersona(id);
    if (!dbPersona) {
      return null;
    }
    return mapDbToPersona(dbPersona);
  }

  /**
   * 성별로 페르소나 필터링
   */
  async getPersonasByGender(gender: "male" | "female"): Promise<Persona[]> {
    const allPersonas = await this.getAllPersonas();
    return allPersonas.filter((p) => p.gender === gender);
  }

  /**
   * 추천 페르소나 조회 (매칭률 기반)
   */
  async getRecommendedPersonas(
    userGender: string,
    limit: number = 5,
  ): Promise<Persona[]> {
    const targetGender = userGender === "female" ? "male" : "female";
    const personas = await this.getPersonasByGender(targetGender);

    // 매칭률 기준 정렬
    return personas.sort((a, b) => b.match_rate - a.match_rate).slice(0, limit);
  }
}

