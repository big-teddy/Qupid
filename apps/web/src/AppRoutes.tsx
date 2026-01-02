import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Persona, AICoach, ConversationAnalysis, UserProfile, ConversationMode } from "@qupid/core";
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
import { Scenario } from "./features/coaching/data/scenarios";

interface AppRoutesProps {
    isGuest: boolean;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ isGuest }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUserStore();
    const { sessionData, setSessionData, updateSessionData } = useSessionStore();
    const { handleOnboardingComplete } = useOnboardingCompletion();

    // FIX: useRequireAuth returns the function directly
    const requireAuth = useRequireAuth();

    // 🚀 게스트 모드이거나 인증된 사용자만 접근 가능
    useEffect(() => {
        const publicPaths = ["/login", "/signup", "/onboarding", "/auth/callback", "/tutorial"];
        const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));

        if (!isPublicPath) {
            requireAuth();
        }
    }, [location.pathname, isGuest, requireAuth]);

    const handleLoginSuccess = (userData: { profile?: UserProfile }) => {
        if (userData.profile) {
            setUser(userData.profile);
            navigate("/home");
        }
    };

    const handleSelectPersona = (persona: Persona) => {
        setSessionData({
            persona,
            partner: persona,
            isTutorial: false,
        });
        navigate("/persona/detail");
    };

    const handleChatTabSelectPersona = (persona: Persona) => {
        setSessionData({
            persona,
            partner: persona,
            isTutorial: false,
        });
        navigate("/persona/detail");
    };

    const handleStartCoachChat = (coach: AICoach) => {
        setSessionData({
            partner: coach,
            isCoaching: true,
            isTutorial: false,
        });
        navigate("/chat/prep");
    };

    const handleStartRoleplay = (scenario: Scenario) => {
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
            conversation_preview: []
        } as unknown as Persona;

        setSessionData({
            partner: roleplayPartner,
            scenario: scenario,
            isCoaching: true,
            isTutorial: false,
            conversationMode: "roleplay" as ConversationMode,
        });
        navigate("/chat/room");
    };

    const handleChatComplete = (analysis: ConversationAnalysis | null) => {
        const currentData = sessionData || {};
        const isTutorial = currentData.isTutorial || false;

        if (analysis) {
            updateSessionData({
                analysis,
                tutorialCompleted: isTutorial
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

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* --- Onboarding & Auth --- */}
                <Route
                    path="/onboarding"
                    element={
                        <OnboardingFlow
                            onComplete={handleOnboardingComplete}
                            onLogin={() => navigate("/signup")}
                            skipIntro={!!localStorage.getItem("authToken")}
                        />
                    }
                />
                <Route
                    path="/onboarding/persona-selection"
                    element={
                        <Pages.PersonaSelection
                            personas={[]}
                            userProfile={user!}
                            onSelect={() => navigate("/chat")}
                            onBack={() => navigate("/home")}
                        />
                    }
                />
                <Route
                    path="/onboarding/recommendation"
                    element={
                        <Pages.PersonaRecommendationIntro
                            onContinue={() => navigate("/onboarding/persona-selection")}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={<Pages.LoginScreen onLoginSuccess={handleLoginSuccess} />}
                />
                <Route
                    path="/signup"
                    element={<Pages.SignupScreen onSignupSuccess={handleLoginSuccess} />}
                />
                <Route path="/auth/callback" element={<Pages.AuthCallback />} />

                {/* --- Main Tabs with Layout --- */}
                <Route element={<MainLayout />}>
                    <Route
                        path="/home"
                        element={<HomeScreen onSelectPersona={handleSelectPersona} />}
                    />
                    <Route
                        path="/chat"
                        element={<Pages.ChatTabScreen onSelectPersona={handleChatTabSelectPersona} />}
                    />
                    <Route
                        path="/coaching"
                        element={
                            <Pages.CoachingTabScreen
                                onStartCoachChat={handleStartCoachChat}
                                onStartRoleplay={handleStartRoleplay}
                            />
                        }
                    />
                    <Route
                        path="/my"
                        element={
                            <Pages.MyTabScreen
                                isGuest={isGuest}
                                onLogout={handleLogout}
                            />
                        }
                    />
                </Route>

                {/* --- Independent Routes --- */}
                <Route
                    path="/tutorial"
                    element={
                        <Pages.TutorialIntroScreen
                            persona={
                                sessionData?.partner || {
                                    id: "tutorial-fallback",
                                    name: "AI 친구",
                                    role: "assistant",
                                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tutorial",
                                    personality: "친절함",
                                    mbti: "ENFJ",
                                    tone: "polite",
                                }
                            }
                            onBack={() => {
                                setSessionData(null);
                                navigate("/onboarding");
                            }}
                            onComplete={() => {
                                updateSessionData({ isTutorial: true, isCoaching: false });
                                navigate("/persona/detail");
                            }}
                        />
                    }
                />
                <Route
                    path="/persona/detail"
                    element={
                        <Pages.PersonaDetailScreen
                            persona={sessionData?.persona || sessionData?.partner}
                            onBack={() => navigate(sessionData?.isTutorial ? "/home" : "/chat")}
                            onStartChat={(persona) => {
                                const isTutorial = sessionData?.isTutorial || false;
                                setSessionData({ persona, partner: persona, isTutorial });
                                navigate("/chat/prep");
                            }}
                        />
                    }
                />
                <Route
                    path="/persona/custom"
                    element={
                        <Pages.CustomPersonaForm
                            category={personaCategory}
                            onCreate={(persona: Persona) => {
                                setSessionData({
                                    persona,
                                    partner: persona,
                                    isTutorial: false,
                                });
                                navigate("/persona/detail");
                            }}
                            onCancel={() => navigate("/chat")}
                        />
                    }
                />
                <Route
                    path="/chat/prep"
                    element={
                        <Pages.ConversationPrepScreen
                            partner={sessionData?.partner}
                            onStart={(mode) => {
                                updateSessionData({ conversationMode: mode });
                                navigate("/chat/room");
                            }}
                            onBack={() => navigate("/chat")}
                        />
                    }
                />
                <Route
                    path="/chat/room"
                    element={
                        <Pages.ChatScreen
                            partner={sessionData?.partner}
                            isTutorial={sessionData?.isTutorial || false}
                            isCoaching={sessionData?.isCoaching || false}
                            conversationMode={(sessionData?.conversationMode as ConversationMode) || "normal"}
                            roleplayScenario={sessionData?.scenario}
                            userProfile={user || undefined}
                            onComplete={(analysis, tutorialJustCompleted) => handleChatComplete(analysis)}
                        />
                    }
                />
                <Route
                    path="/chat/analysis"
                    element={
                        <Pages.ConversationAnalysisScreen
                            analysis={sessionData?.analysis}
                            tutorialJustCompleted={sessionData?.tutorialCompleted}
                            onHome={() => navigate("/home")}
                            onBack={() => {
                                const isCoach = sessionData?.partner && "specialty" in sessionData.partner;
                                navigate(isCoach ? "/coaching" : "/chat");
                            }}
                        />
                    }
                />

                {/* --- Coaching Sub-routes --- */}
                <Route
                    path="/coaching/style"
                    element={<Pages.StylingCoach onBack={() => navigate("/coaching")} />}
                />
                <Route
                    path="/coaching/goals"
                    element={<Pages.LearningGoalsScreen onBack={() => navigate("/my")} />}
                />

                {/* --- Profile Sub-routes --- */}
                <Route
                    path="/my/profile"
                    element={
                        <Pages.ProfileEditScreen
                            userProfile={user!}
                            onBack={() => navigate("/my")}
                            onSave={(p) => {
                                setUser(p);
                                navigate("/my");
                            }}
                        />
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Pages.SettingsScreen
                            onBack={() => navigate("/my")}
                            onLogout={handleLogout}
                        />
                    }
                />
                <Route
                    path="/my/badges"
                    element={<BadgesContainer onBack={() => navigate("/my")} />}
                />
                <Route
                    path="/my/favorites"
                    element={
                        <Pages.FavoritesScreen
                            personas={[]}
                            onBack={() => navigate("/my")}
                            onSelectPersona={handleSelectPersona}
                        />
                    }
                />
                <Route
                    path="/settings/notification"
                    element={
                        <Pages.NotificationSettingsScreen
                            onBack={() => navigate("/settings")}
                            notificationTime="19:00"
                            doNotDisturbStart="22:00"
                            doNotDisturbEnd="08:00"
                            onSave={() => { }}
                        />
                    }
                />
                <Route
                    path="/settings/delete"
                    element={
                        <Pages.DeleteAccountScreen
                            onBack={() => navigate("/settings")}
                            onComplete={() => {
                                localStorage.clear();
                                setUser(null);
                                navigate("/onboarding");
                            }}
                        />
                    }
                />

                {/* --- Analytics --- */}
                <Route
                    path="/analytics/performance"
                    element={<Pages.PerformanceDetailScreen onBack={() => navigate("/home")} />}
                />
                <Route
                    path="/analytics/export"
                    element={<Pages.DataExportScreen onBack={() => navigate("/settings")} />}
                />
                <Route
                    path="/my/design"
                    element={<Pages.DesignGuideScreen onBack={() => navigate("/my")} />}
                />

                <Route path="/" element={<Navigate to="/onboarding" replace />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </Routes>
        </Suspense>
    );
};
