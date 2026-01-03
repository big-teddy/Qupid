import OpenAI from "openai";
import { AppError } from "../../../shared/errors/AppError.js";
import {
  getMBTIBehaviorRules,
  getMBTIDialogueExamples,
  generatePersonalityProfile,
  getFirstMessagePatterns,
} from "@qupid/core";
import { buildAdvancedSystemPrompt } from "../domain/DynamicPromptBuilder.js";
import { getPresetAvatar } from "../domain/PresetAvatarService.js";
import {
  PERSONA_GENERATION_SYSTEM_PROMPT,
  createPersonaGenerationUserPrompt,
} from "../domain/PromptTemplates.js";

/**
 * Input profile for persona generation (subset of full UserProfile)
 */
export interface UserProfileInput {
  name?: string;
  age?: number;
  gender?: string;
  job?: string;
  interests?: string[];
  experience?: string;
  mbti?: string;
  personality?: string[];
}

export interface DynamicPersona {
  name: string;
  age: number;
  gender: "male" | "female";
  job: string;
  mbti: string;
  avatar: string;
  intro: string;
  tags: string[];
  match_rate: number;
  systemInstruction: string;
  personality_traits: string[];
  interests: Array<{
    emoji: string;
    topic: string;
    description: string;
  }>;
  conversation_preview: Array<{
    sender: "ai";
    text: string;
  }>;
  compatibility_reason: string;
}

export class DynamicPersonaService {
  private openai: OpenAI;

  constructor(openaiClient?: OpenAI) {
    this.openai =
      openaiClient ||
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
  }

  /**
   * 사용자 프로필 기반으로 동적 페르소나 생성
   */
  async generateDynamicPersona(
    userProfile: UserProfileInput,
    personaCount: number = 1,
  ): Promise<DynamicPersona[]> {
    try {
      const prompt = this.buildPersonaGenerationPrompt(
        userProfile,
        personaCount,
      );

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: PERSONA_GENERATION_SYSTEM_PROMPT,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      const jsonText = response.choices[0]?.message?.content || "{}";
      const result = JSON.parse(jsonText);

      if (result.personas && Array.isArray(result.personas)) {
        return result.personas.map((persona: any) =>
          this.formatPersona(persona, userProfile),
        );
      }

      throw new Error("Invalid persona generation response");
    } catch (error) {
      console.error("Error generating dynamic persona:", error);
      throw AppError.internal("Failed to generate dynamic persona", error);
    }
  }

  /**
   * 페르소나 생성 프롬프트 구성
   */
  private buildPersonaGenerationPrompt(
    userProfile: UserProfileInput,
    count: number,
  ): string {
    const targetGender = userProfile.gender === "male" ? "female" : "male";
    const targetGenderKorean = targetGender === "female" ? "여성" : "남성";

    const userInterests = userProfile.interests?.length
      ? userProfile.interests.join(", ")
      : "게임, 영화, 음악";

    return createPersonaGenerationUserPrompt(
      count,
      targetGenderKorean,
      targetGender,
      {
        name: userProfile.name || "Unknown",
        age: userProfile.age || 25,
        gender: userProfile.gender || "male",
        interests: userInterests,
        experience: userProfile.experience || "보통",
        mbti: userProfile.mbti || "Unknown",
      }
    );
  }

  /**
   * 페르소나 포맷팅 및 시스템 인스트럭션 생성
   */
  private formatPersona(
    persona: any,
    userProfile: UserProfileInput,
  ): DynamicPersona {
    const systemInstruction = this.generateSystemInstruction(
      persona,
      userProfile,
    );
    const avatar = this.generateAvatar(persona.name, persona.gender);

    return {
      name: persona.name,
      age: persona.age,
      gender: persona.gender,
      job: persona.job,
      mbti: persona.mbti,
      avatar,
      intro: persona.intro,
      tags: persona.tags,
      match_rate: persona.match_rate,
      systemInstruction,
      personality_traits: persona.personality_traits,
      interests: persona.interests,
      conversation_preview: [
        {
          sender: "ai",
          text: this.generateFirstMessage(persona, userProfile),
        },
      ],
      compatibility_reason: persona.compatibility_reason,
    };
  }

  /**
   * 페르소나별 시스템 인스트럭션 생성 (고급 MBTI 기반)
   */
  private generateSystemInstruction(
    persona: any,
    userProfile: UserProfileInput,
  ): string {
    return buildAdvancedSystemPrompt(
      {
        name: persona.name,
        age: persona.age,
        gender: persona.gender,
        job: persona.job,
        mbti: persona.mbti,
        interests: persona.interests,
        personality_traits: persona.personality_traits,
        compatibility_reason: persona.compatibility_reason,
      },
      {
        name: userProfile.name,
        age: userProfile.age,
        gender: userProfile.gender,
        interests: userProfile.interests,
        mbti: userProfile.mbti,
      },
      undefined,
    );
  }

  /**
   * 첫 메시지 생성 (자연스러운 카톡 스타일)
   */
  private generateFirstMessage(persona: any, userProfile: UserProfileInput): string {
    const sharedInterest = persona.interests?.[0]?.topic || "재미있는 것";
    const patterns = getFirstMessagePatterns(persona.mbti || "ISFJ");

    let seed = 0;
    for (let i = 0; i < persona.name.length; i++) {
      seed += persona.name.charCodeAt(i);
    }

    const selectedPattern = patterns[seed % patterns.length];
    return selectedPattern.replace("{topic}", sharedInterest);
  }

  /**
   * 아바타 URL 생성
   */
  private generateAvatar(_name: string, gender: "male" | "female"): string {
    return getPresetAvatar(gender);
  }

  /**
   * 사용자와의 궁합도 계산
   */
  private calculateCompatibility(
    persona: any,
    userProfile: UserProfileInput,
  ): number {
    let score = 70;

    if (userProfile.age && Math.abs(persona.age - userProfile.age) <= 5) {
      score += 10;
    }

    if (userProfile.interests && persona.interests) {
      const commonInterests = persona.interests.filter((interest: any) =>
        userProfile.interests?.some(
          (userInterest) =>
            interest.topic.toLowerCase().includes(userInterest.toLowerCase()) ||
            userInterest.toLowerCase().includes(interest.topic.toLowerCase()),
        ),
      );
      score += commonInterests.length * 5;
    }

    // MBTI 호환성 (간단한 매칭)
    const compatiblePairs = [
      ["ENFP", "INTJ"],
      ["ISFJ", "ENTP"],
      ["ESFP", "ISFJ"],
      ["INFP", "ENFJ"],
      ["ESTP", "ISTJ"],
      ["INTP", "ENTJ"],
    ];

    if (userProfile.mbti && persona.mbti) {
      const isCompatible = compatiblePairs.some(
        (pair) =>
          (pair[0] === userProfile.mbti && pair[1] === persona.mbti) ||
          (pair[1] === userProfile.mbti && pair[0] === persona.mbti),
      );
      if (isCompatible) score += 15;
    }

    return Math.min(95, Math.max(70, score));
  }
}
