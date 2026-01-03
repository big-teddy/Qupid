import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useUserStore } from "./shared/stores/userStore";
import { useSessionStore } from "./shared/stores/sessionStore";
import { MainLayout } from "./shared/layout/MainLayout";
import { HomeScreen } from "./shared/components/HomeScreen";
import { OnboardingFlow } from "./features/onboarding/components/OnboardingFlow";
import { useRequireAuth } from "./features/auth/hooks/useAuthInit";
import { useOnboardingCompletion } from "./features/onboarding/hooks/useOnboardingCompletion";
import { BadgesContainer } from "./features/profile/components/BadgesContainer";
// Use local LoadingSpinner to avoid package resolution issues
import { LoadingSpinner } from "./shared/components/LoadingSpinner";
import * as Pages from "./routes/LazyComponents";
export const AppRoutes = ({ isGuest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUserStore();
  const { sessionData, setSessionData, updateSessionData } = useSessionStore();
  const { handleOnboardingComplete } = useOnboardingCompletion();
  // FIX: useRequireAuth returns the function directly
  const requireAuth = useRequireAuth();
  // 🚀 게스트 모드이거나 인증된 사용자만 접근 가능
  useEffect(() => {
    // "/" is included because it redirects to /onboarding for new users
    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/onboarding",
      "/auth/callback",
      "/tutorial",
    ];
    const isPublicPath = publicPaths.some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/"),
    );
    if (!isPublicPath) {
      requireAuth();
    }
  }, [location.pathname, isGuest, requireAuth]);
  const handleLoginSuccess = (userData) => {
    if (userData.profile) {
      setUser(userData.profile);
      navigate("/home");
    }
  };
  const handleSelectPersona = (persona) => {
    setSessionData({
      persona,
      partner: persona,
      isTutorial: false,
    });
    navigate("/persona/detail");
  };
  const handleChatTabSelectPersona = (persona) => {
    setSessionData({
      persona,
      partner: persona,
      isTutorial: false,
    });
    navigate("/persona/detail");
  };
  const handleStartCoachChat = (coach) => {
    setSessionData({
      partner: coach,
      isCoaching: true,
      isTutorial: false,
    });
    navigate("/chat/prep");
  };
  const handleStartRoleplay = (scenario) => {
    // 시나리오에 맞는 코치(파트너) 찾기 또는 생성
    // Fix: Use 'as any' to bypass strict field checks for roleplay partner construction
    // until Persona interface is updated in core
    const roleplayPartner = {
      id: `roleplay-${scenario.id}`,
      name: scenario.title, // Use title as name
      role: "assistant", // 'assistant' | 'user' | 'system'
      avatar: scenario.emoji, // Use emoji as avatar (or placeholder)
      personality: scenario.difficulty, // personality 필드에 difficulty 매핑
      mbti: "ESTJ", // 임의 설정
      tone: "professional", // 임의 설정
      job: "Roleplay Partner",
      age: 25,
      gender: "female",
      intro: scenario.description,
      tags: [],
      match_rate: 0,
      system_instruction: scenario.systemPrompt,
      personality_traits: [],
      interests: [],
      conversation_preview: [],
    };
    setSessionData({
      partner: roleplayPartner,
      scenario: scenario,
      isCoaching: true,
      isTutorial: false,
      conversationMode: "roleplay",
    });
    navigate("/chat/room");
  };
  const handleChatComplete = (analysis) => {
    const currentData = sessionData || {};
    const isTutorial = currentData.isTutorial || false;
    if (analysis) {
      updateSessionData({
        analysis,
        tutorialCompleted: isTutorial,
      });
    }
    navigate("/chat/analysis");
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_storage");
    localStorage.removeItem("session_storage");
    setUser(null);
    setSessionData(null);
    navigate("/login");
  };
  // Determine personality category for custom persona
  const personaCategory = location.state?.category || "friend";
  return _jsx(Suspense, {
    fallback: _jsx(LoadingSpinner, {}),
    children: _jsxs(Routes, {
      children: [
        _jsx(Route, {
          path: "/onboarding",
          element: _jsx(OnboardingFlow, {
            onComplete: handleOnboardingComplete,
            onLogin: () => navigate("/login"),
            skipIntro: !!localStorage.getItem("authToken"),
          }),
        }),
        _jsx(Route, {
          path: "/onboarding/persona-selection",
          element: _jsx(Pages.PersonaSelection, {
            personas: [],
            userProfile: user,
            onSelect: () => navigate("/chat"),
            onBack: () => navigate("/home"),
          }),
        }),
        _jsx(Route, {
          path: "/onboarding/recommendation",
          element: _jsx(Pages.PersonaRecommendationIntro, {
            onContinue: () => navigate("/onboarding/persona-selection"),
          }),
        }),
        _jsx(Route, {
          path: "/login",
          element: _jsx(Pages.LoginScreen, {
            onLoginSuccess: handleLoginSuccess,
          }),
        }),
        _jsx(Route, {
          path: "/signup",
          element: _jsx(Pages.SignupScreen, {
            onSignupSuccess: handleLoginSuccess,
          }),
        }),
        _jsx(Route, {
          path: "/auth/callback",
          element: _jsx(Pages.AuthCallback, {}),
        }),
        _jsxs(Route, {
          element: _jsx(MainLayout, {}),
          children: [
            _jsx(Route, {
              path: "/home",
              element: _jsx(HomeScreen, {
                onSelectPersona: handleSelectPersona,
              }),
            }),
            _jsx(Route, {
              path: "/chat",
              element: _jsx(Pages.ChatTabScreen, {
                onSelectPersona: handleChatTabSelectPersona,
              }),
            }),
            _jsx(Route, {
              path: "/coaching",
              element: _jsx(Pages.CoachingTabScreen, {
                onStartCoachChat: handleStartCoachChat,
                onStartRoleplay: handleStartRoleplay,
              }),
            }),
            _jsx(Route, {
              path: "/my",
              element: _jsx(Pages.MyTabScreen, {
                isGuest: isGuest,
                onLogout: handleLogout,
              }),
            }),
          ],
        }),
        _jsx(Route, {
          path: "/tutorial",
          element: _jsx(Pages.TutorialIntroScreen, {
            persona: sessionData?.partner || {
              id: "tutorial-fallback",
              name: "AI 친구",
              role: "assistant",
              avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=tutorial",
              personality: "친절함",
              mbti: "ENFJ",
              tone: "polite",
            },
            onBack: () => {
              setSessionData(null);
              navigate("/onboarding");
            },
            onComplete: () => {
              updateSessionData({ isTutorial: true, isCoaching: false });
              navigate("/persona/detail");
            },
          }),
        }),
        _jsx(Route, {
          path: "/persona/detail",
          element: _jsx(Pages.PersonaDetailScreen, {
            persona: sessionData?.persona || sessionData?.partner,
            onBack: () => navigate(sessionData?.isTutorial ? "/home" : "/chat"),
            onStartChat: (persona) => {
              const isTutorial = sessionData?.isTutorial || false;
              setSessionData({ persona, partner: persona, isTutorial });
              navigate("/chat/prep");
            },
          }),
        }),
        _jsx(Route, {
          path: "/persona/custom",
          element: _jsx(Pages.CustomPersonaForm, {
            category: personaCategory,
            onCreate: (persona) => {
              setSessionData({
                persona,
                partner: persona,
                isTutorial: false,
              });
              navigate("/persona/detail");
            },
            onCancel: () => navigate("/chat"),
          }),
        }),
        _jsx(Route, {
          path: "/chat/prep",
          element: _jsx(Pages.ConversationPrepScreen, {
            partner: sessionData?.partner,
            onStart: (mode) => {
              updateSessionData({ conversationMode: mode });
              navigate("/chat/room");
            },
            onBack: () => navigate("/chat"),
          }),
        }),
        _jsx(Route, {
          path: "/chat/room",
          element: _jsx(Pages.ChatScreen, {
            partner: sessionData?.partner,
            isTutorial: sessionData?.isTutorial || false,
            isCoaching: sessionData?.isCoaching || false,
            conversationMode: sessionData?.conversationMode || "normal",
            roleplayScenario: sessionData?.scenario,
            userProfile: user || undefined,
            onComplete: (analysis, tutorialJustCompleted) =>
              handleChatComplete(analysis),
          }),
        }),
        _jsx(Route, {
          path: "/chat/analysis",
          element: _jsx(Pages.ConversationAnalysisScreen, {
            analysis: sessionData?.analysis,
            tutorialJustCompleted: sessionData?.tutorialCompleted,
            onHome: () => navigate("/home"),
            onBack: () => {
              const isCoach =
                sessionData?.partner && "specialty" in sessionData.partner;
              navigate(isCoach ? "/coaching" : "/chat");
            },
          }),
        }),
        _jsx(Route, {
          path: "/coaching/style",
          element: _jsx(Pages.StylingCoach, {
            onBack: () => navigate("/coaching"),
          }),
        }),
        _jsx(Route, {
          path: "/coaching/goals",
          element: _jsx(Pages.LearningGoalsScreen, {
            onBack: () => navigate("/my"),
          }),
        }),
        _jsx(Route, {
          path: "/my/profile",
          element: _jsx(Pages.ProfileEditScreen, {
            userProfile: user,
            onBack: () => navigate("/my"),
            onSave: (p) => {
              setUser(p);
              navigate("/my");
            },
          }),
        }),
        _jsx(Route, {
          path: "/settings",
          element: _jsx(Pages.SettingsScreen, {
            onBack: () => navigate("/my"),
            onLogout: handleLogout,
          }),
        }),
        _jsx(Route, {
          path: "/my/badges",
          element: _jsx(BadgesContainer, { onBack: () => navigate("/my") }),
        }),
        _jsx(Route, {
          path: "/my/favorites",
          element: _jsx(Pages.FavoritesScreen, {
            personas: [],
            onBack: () => navigate("/my"),
            onSelectPersona: handleSelectPersona,
          }),
        }),
        _jsx(Route, {
          path: "/settings/notification",
          element: _jsx(Pages.NotificationSettingsScreen, {
            onBack: () => navigate("/settings"),
            notificationTime: "19:00",
            doNotDisturbStart: "22:00",
            doNotDisturbEnd: "08:00",
            onSave: () => {},
          }),
        }),
        _jsx(Route, {
          path: "/settings/delete",
          element: _jsx(Pages.DeleteAccountScreen, {
            onBack: () => navigate("/settings"),
            onComplete: () => {
              localStorage.clear();
              setUser(null);
              navigate("/onboarding");
            },
          }),
        }),
        _jsx(Route, {
          path: "/analytics/performance",
          element: _jsx(Pages.PerformanceDetailScreen, {
            onBack: () => navigate("/home"),
          }),
        }),
        _jsx(Route, {
          path: "/analytics/export",
          element: _jsx(Pages.DataExportScreen, {
            onBack: () => navigate("/settings"),
          }),
        }),
        _jsx(Route, {
          path: "/my/design",
          element: _jsx(Pages.DesignGuideScreen, {
            onBack: () => navigate("/my"),
          }),
        }),
        _jsx(Route, {
          path: "/",
          element: _jsx(Navigate, { to: "/onboarding", replace: true }),
        }),
        _jsx(Route, {
          path: "*",
          element: _jsx(Navigate, { to: "/onboarding", replace: true }),
        }),
      ],
    }),
  });
};
