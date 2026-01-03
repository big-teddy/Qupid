import React from "react";
// Chat Components
export const ChatTabScreen = React.lazy(
  () => import("../features/chat/components/ChatTabScreen"),
);
export const ChatScreen = React.lazy(
  () => import("../features/chat/components/ChatScreen"),
);
export const ConversationPrepScreen = React.lazy(
  () => import("../features/chat/components/ConversationPrepScreen"),
);
export const ConversationAnalysisScreen = React.lazy(
  () => import("../features/chat/components/ConversationAnalysisScreen"),
);
export const PersonaDetailScreen = React.lazy(
  () => import("../features/chat/components/PersonaDetailScreen"),
);
export const CustomPersonaForm = React.lazy(
  () => import("../features/chat/components/CustomPersonaForm"),
);
// Onboarding Components
export const TutorialIntroScreen = React.lazy(
  () => import("../features/onboarding/components/TutorialIntroScreen"),
);
export const PersonaSelection = React.lazy(
  () => import("../features/onboarding/components/PersonaSelection"),
);
export const PersonaRecommendationIntro = React.lazy(
  () => import("../features/onboarding/components/PersonaRecommendationIntro"),
);
// Coaching Components
export const CoachingTabScreen = React.lazy(
  () => import("../features/coaching/components/CoachingTabScreen"),
);
export const StylingCoach = React.lazy(
  () => import("../features/coaching/components/StylingCoach"),
);
export const LearningGoalsScreen = React.lazy(
  () => import("../features/coaching/components/LearningGoalsScreen"),
);
// Profile Components
export const MyTabScreen = React.lazy(
  () => import("../features/profile/components/MyTabScreen"),
);
export const ProfileEditScreen = React.lazy(
  () => import("../features/profile/components/ProfileEditScreen"),
);
export const SettingsScreen = React.lazy(
  () => import("../features/profile/components/SettingsScreen"),
);
export const BadgesScreen = React.lazy(
  () => import("../features/profile/components/BadgesScreen"),
);
export const FavoritesScreen = React.lazy(
  () => import("../features/profile/components/FavoritesScreen"),
);
export const NotificationSettingsScreen = React.lazy(
  () => import("../features/profile/components/NotificationSettingsScreen"),
);
export const DeleteAccountScreen = React.lazy(
  () => import("../features/profile/components/DeleteAccountScreen"),
);
export const DesignGuideScreen = React.lazy(
  () => import("../features/profile/components/DesignGuideScreen"),
);
// Analytics Components
export const PerformanceDetailScreen = React.lazy(
  () => import("../features/analytics/components/PerformanceDetailScreen"),
);
export const DataExportScreen = React.lazy(
  () => import("../features/analytics/components/DataExportScreen"),
);
// Auth Components
export const LoginScreen = React.lazy(
  () => import("../features/auth/components/LoginScreen"),
);
export const SignupScreen = React.lazy(
  () => import("../features/auth/components/SignupScreen"),
);
export const AuthCallback = React.lazy(
  () => import("../features/auth/components/AuthCallback"),
);
