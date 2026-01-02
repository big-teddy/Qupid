import { UserProfile } from "@qupid/core";

export type NewUserProfile = Omit<
    UserProfile,
    "id" | "created_at" | "isTutorialCompleted"
>;

export const initialProfile: NewUserProfile = {
    name: "준호",
    user_gender: "male",
    experience: "없음",
    confidence: 3,
    difficulty: 2,
    interests: [],
};
