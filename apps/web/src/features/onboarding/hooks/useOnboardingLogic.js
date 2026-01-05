import { useState, useCallback } from "react";
import { useCreateUserProfile } from "../../../shared/hooks/api/useUser";
import { useGeneratePersona } from "../../../shared/hooks/usePersonaGeneration";
import { initialProfile } from "../types";
import { generateTutorialPersona, createFallbackPersona, } from "../services/PersonaGenerator";
import Logger from "../../../shared/utils/logger";
import { getUserIdFromToken } from "../../../shared/lib/auth-utils";
export const useOnboardingLogic = (onComplete, skipIntro = false) => {
    const [step, setStep] = useState(skipIntro ? 1 : 0);
    const [profile, setProfile] = useState(initialProfile);
    const createUser = useCreateUserProfile();
    const generatePersona = useGeneratePersona();
    const nextStep = useCallback(() => setStep((s) => s + 1), []);
    const prevStep = useCallback(() => setStep((s) => (s > 0 ? s - 1 : 0)), []);
    const handleGenderSelect = (gender) => {
        setProfile((p) => ({ ...p, user_gender: gender }));
        nextStep();
    };
    const handleSurveyComplete = (field, value) => {
        setProfile((p) => ({ ...p, [field]: value }));
        nextStep();
    };
    const handleInterestComplete = (interests) => {
        setProfile((p) => ({ ...p, interests }));
        nextStep();
    };
    const handleFinalComplete = useCallback(async () => {
        try {
            Logger.info("🎯 온보딩 완료 처리 시작:", profile);
            // 로그인한 사용자의 ID 가져오기 (JWT에서 추출)
            let userId;
            const authToken = localStorage.getItem("authToken");
            if (authToken) {
                const extractedId = getUserIdFromToken(authToken);
                if (extractedId) {
                    userId = extractedId;
                    Logger.info("🔑 인증된 사용자 ID:", userId);
                }
            }
            // Create user in database
            const userProfile = {
                id: userId,
                name: "사용자",
                user_gender: profile.user_gender,
                partner_gender: profile.user_gender === "male" ? "female" : "male",
                experience: profile.experience,
                confidence: profile.experience === "전혈 없어요"
                    ? 2
                    : profile.experience === "1-2번 정도"
                        ? 3
                        : profile.experience === "몇 번 있어요"
                            ? 4
                            : 5,
                difficulty: profile.experience === "전혈 없어요"
                    ? 1
                    : profile.experience === "1-2번 정도"
                        ? 2
                        : profile.experience === "몇 번 있어요"
                            ? 3
                            : 4,
                interests: profile.interests.map((i) => i.split(" ")[1] || i),
                isTutorialCompleted: false,
            };
            Logger.info("👤 사용자 프로필 생성:", userProfile);
            let tutorialPersona = null;
            const result = await createUser.mutateAsync(userProfile);
            Logger.info("💾 사용자 생성 결과:", result);
            if (result?.id) {
                Logger.info("🤖 튜토리얼 페르소나 생성 시도...");
                tutorialPersona = await generateTutorialPersona(profile, generatePersona);
                Logger.info("✅ 생성된 튜토리얼 페르소나:", tutorialPersona);
            }
            if (!tutorialPersona) {
                Logger.info("⚠️ 튜토리얼 페르소나가 없음, 기본 페르소나 생성");
                tutorialPersona = createFallbackPersona(profile);
            }
            onComplete(profile, tutorialPersona);
        }
        catch (error) {
            Logger.error("❌ 사용자 프로필 생성 실패:", error);
            Logger.info("🆘 완전 실패, 동적 생성된 기본 페르소나로 진행");
            const fallbackPersona = createFallbackPersona(profile);
            onComplete(profile, fallbackPersona);
        }
    }, [createUser, onComplete, profile, generatePersona]);
    return {
        step,
        profile,
        nextStep,
        prevStep,
        handleGenderSelect,
        handleSurveyComplete,
        handleInterestComplete,
        handleFinalComplete,
    };
};
