import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../../shared/stores/userStore";
import { useSessionStore } from "../../../shared/stores/sessionStore";
import Logger from "../../../shared/utils/logger";
/**
 * useAuthInit Hook
 *
 * Handles authentication initialization logic on app startup:
 * - Token parsing from URL (OAuth callback)
 * - Guest user restoration from localStorage
 * - Authenticated user restoration from localStorage
 * - Redirects based on auth state
 */
export function useAuthInit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUserStore();
  const { setSessionData } = useSessionStore();
  const [isGuest, setIsGuest] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    console.log("[DEBUG] useAuthInit useEffect started");
    try {
      // Tutorial Session Data restoration
      const tutorialSessionData = localStorage.getItem("tutorialSessionData");
      console.log(
        "[DEBUG] tutorialSessionData:",
        tutorialSessionData ? "found" : "null",
      );
      if (tutorialSessionData) {
        try {
          const session = JSON.parse(tutorialSessionData);
          setSessionData(session);
        } catch (e) {
          Logger.error("Failed to parse tutorial session data:", e);
        }
      }
      // Check for OAuth callback tokens in URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const refreshToken = urlParams.get("refresh_token");
      console.log("[DEBUG] Tokens in URL:", !!token);
      if (token && refreshToken) {
        const isOnboardingFlow =
          localStorage.getItem("isOnboardingFlow") === "true";
        if (isOnboardingFlow) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.removeItem("isOnboardingFlow");
          navigate("/onboarding");
        } else {
          navigate("/auth/callback");
        }
        setIsInitialized(true);
        return;
      }
      // Check for existing auth state
      const authToken = localStorage.getItem("authToken");
      const storedProfile = localStorage.getItem("userProfile");
      const guestId = localStorage.getItem("guestId");
      const hasCompletedOnboarding = localStorage.getItem(
        "hasCompletedOnboarding",
      );
      console.log(
        "[DEBUG] Auth check - Token:",
        !!authToken,
        "Profile:",
        !!storedProfile,
      );
      if (authToken && storedProfile) {
        // Authenticated user with profile
        const profile = JSON.parse(storedProfile);
        setUser(profile);
        if (
          location.pathname === "/" ||
          location.pathname === "/login" ||
          location.pathname === "/signup"
        ) {
          navigate("/home");
        }
      } else if (authToken) {
        // Authenticated user without profile (needs onboarding)
        navigate("/onboarding");
      } else if (hasCompletedOnboarding && guestId) {
        // Guest user
        const guestProfile = {
          id: guestId,
          name: "게스트",
          user_gender: localStorage.getItem("guestGender") || "male",
          partner_gender:
            localStorage.getItem("guestPartnerGender") || "female",
          experience: localStorage.getItem("guestExperience") || "없음",
          confidence: parseInt(localStorage.getItem("guestConfidence") || "3"),
          difficulty: parseInt(localStorage.getItem("guestDifficulty") || "2"),
          interests: JSON.parse(localStorage.getItem("guestInterests") || "[]"),
          isTutorialCompleted:
            localStorage.getItem("guestTutorialCompleted") === "true",
          isGuest: true,
        };
        setUser(guestProfile);
        setIsGuest(true);
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate("/home");
        }
      } else {
        // New user
        console.log("[DEBUG] New user detected");
        if (location.pathname === "/" || location.pathname === "/home") {
          navigate("/onboarding");
        }
      }
      console.log("[DEBUG] Setting initialized to true");
      setIsInitialized(true);
    } catch (err) {
      console.error("[DEBUG] useAuthInit CRASHED:", err);
      setIsInitialized(true); // Recover to show something?
    }
  }, [navigate, location.pathname, setUser, setSessionData]);
  return {
    isGuest,
    isLoggedIn: !!user,
    isInitialized,
  };
}
/**
 * Helper function to check if user has auth access
 * Can be used for protected routes
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const isGuest = user?.isGuest ?? false;
  return (callback) => {
    if (isGuest) {
      const confirmSignup = window.confirm(
        "이 기능을 사용하려면 회원가입이 필요합니다. 회원가입 하시겠습니까?",
      );
      if (confirmSignup) navigate("/signup");
      return false;
    } else if (!user) {
      navigate("/login");
      return false;
    }
    if (callback) callback();
    return true;
  };
}
