import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../shared/stores/userStore";
import { useSessionStore } from "../../../shared/stores/sessionStore";
import { UserProfile, Persona } from "@qupid/core";
import { NewUserProfile } from "../types";

export const useOnboardingCompletion = () => {
    const navigate = useNavigate();
    const { setUser } = useUserStore();
    const { setSessionData } = useSessionStore();

    const handleOnboardingComplete = (profile: NewUserProfile, tutorialPersona?: Persona) => {
        const guestId = `guest_${new Date().getTime()}`;
        const newProfile: UserProfile = {
            ...profile,
            id: guestId,
            name: "게스트",
            created_at: new Date().toISOString(),
            isTutorialCompleted: false,
            isGuest: true,
        };

        localStorage.setItem("guestId", guestId);
        localStorage.setItem("guestGender", profile.user_gender);
        // partner_gender might be missing in profile depending on upstream logic
        if (profile.partner_gender) {
            localStorage.setItem("guestPartnerGender", profile.partner_gender);
        }
        localStorage.setItem("guestExperience", profile.experience);
        localStorage.setItem("guestConfidence", profile.confidence.toString());
        localStorage.setItem("guestDifficulty", profile.difficulty.toString());
        localStorage.setItem(
            "guestInterests",
            JSON.stringify(profile.interests || []),
        );
        localStorage.setItem("hasCompletedOnboarding", "true");

        setUser(newProfile);

        if (tutorialPersona) {
            setSessionData({
                persona: tutorialPersona,
                partner: tutorialPersona,
                isTutorial: true,
            });
            navigate("/tutorial");
        } else {
            navigate("/tutorial");
        }
    };

    return { handleOnboardingComplete };
};
