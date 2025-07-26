import { Persona, UserProfile, Screen, ConversationAnalysis, Badge, PerformanceData } from './index';

export interface HomeScreenProps {
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onSelectPersona: (persona: Persona) => void;
  isTutorialCompleted: boolean;
  onStartTutorial: () => void;
  onCreateCustomPersona: () => void;
  customPersonas: Persona[];
  onSelectCustomPersona: (persona: Persona) => void;
}

export interface PersonaSelectionProps {
  personas: Persona[];
  userProfile: UserProfile | null;
  onSelect: (persona: Persona) => void;
  onBack: () => void;
  onCreateCustomPersona: () => void;
  onSelectCustomPersona: (persona: Persona) => void;
}

export interface PersonaDetailScreenProps {
  persona: Persona;
  onStartChat: (persona: Persona) => void;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (personaId: string) => void;
}

export interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export interface ChatScreenProps {
  persona: Persona;
  isTutorial: boolean;
  onComplete: (analysis: ConversationAnalysis | null) => void;
  onBack: () => void;
}

export interface ConversationAnalysisScreenProps {
  analysis: ConversationAnalysis;
  persona: Persona;
  onNext: () => void;
  onBack: () => void;
}

export interface FavoritesScreenProps {
  personas: Persona[];
  onSelectPersona: (persona: Persona) => void;
  onBack: () => void;
}

export interface BadgesScreenProps {
  badges: Badge[];
  onBack: () => void;
}

export interface PerformanceDetailScreenProps {
  data: PerformanceData;
  onBack: () => void;
}
// 필요에 따라 추가 컴포넌트 props 타입 정의 