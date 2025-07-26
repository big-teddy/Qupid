
export interface Persona {
  id: string;
  user_id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  job: string;
  mbti: string;
  intro: string;
  avatar: string;
  matchRate: number;
  personalityTraits: string[];
  interests: { topic: string; emoji: string; description: string }[];
  tags: string[];
  conversationPreview: { sender: 'user' | 'ai'; text: string }[];
  systemInstruction?: string; // AI 시스템 지시사항
  custom?: boolean; // 맞춤 페르소나 여부
  description?: string; // 맞춤 페르소나용 설명
  created_at?: string;
}

export interface Message {
  sender: 'user' | 'ai' | 'system';
  text: string;
}

export enum Screen {
  Home = 'Home',
  PersonaSelection = 'PersonaSelection',
  PersonaDetail = 'PersonaDetail',
  ConversationPrep = 'ConversationPrep',
  Chat = 'Chat',
  ConversationAnalysis = 'ConversationAnalysis',
  PerformanceDetail = 'PerformanceDetail',
  Favorites = 'Favorites',
  Badges = 'Badges',
  Settings = 'Settings',
  ProfileEdit = 'ProfileEdit',
  LearningGoals = 'LearningGoals',
  NotificationSettings = 'NotificationSettings',
  DataExport = 'DataExport',
  DeleteAccount = 'DeleteAccount',
  CustomPersonaForm = 'CustomPersonaForm',
  DatabaseTest = 'DatabaseTest',
}

export interface UserProfile {
  id: string;
  name: string; // Add name for personalization
  email: string; // 사용자 이메일
  user_gender: 'male' | 'female' | null;
  experience: string | null;
  confidence: string | null;
  difficulty: string | null;
  interests: string[];
  profile_image_url: string | null; // 프로필 이미지 URL
  created_at: string; // 생성일
  updated_at: string; // 수정일
  last_login_at: string; // 마지막 로그인일
  is_active: boolean; // 활성 상태
  subscription_tier: string; // 구독 등급
  level: number; // 사용자 레벨 (1-10)
  experiencePoints: number; // 경험치
  totalConversations: number; // 총 대화 수
  averageScore: number; // 평균 점수
  streakDays: number; // 연속 사용 일수
  lastActiveDate: string; // 마지막 활동일
}

export interface ConversationAnalysis {
  overallScore: number;
  friendliness: number;
  curiosity: number;
  empathy: number;
  feedback: string;
  positivePoints: string[];
  pointsToImprove: any;
}

export interface RealtimeFeedback {
    isGood: boolean;
    message: string;
}

export interface TutorialStep {
    step: number;
    title: string;
    description: string;
    quickReplies: string[];
    successCriteria: (message: string, context: Message[]) => boolean;
}

export interface PerformanceData {
  weeklyScore: number;
  scoreChange: number;
  scoreChangePercentage: number;
  dailyScores: number[];
  radarData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  stats: {
    totalTime: string;
    sessionCount: number;
    avgTime: string;
    longestSession: { time: string; persona: string; };
    preferredType: string;
  };
  categoryScores: {
    title: string;
    emoji: string;
    score: number;
    change: number;
    goal: number;
  }[];
}


export interface Badge {
  id: string;
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  badgeCategory: string;
  badgeRarity: string;
  acquired: boolean;
  acquiredDate?: string;
  progressCurrent: number;
  progressTotal: number;
  featured: boolean;
}

export interface Achievement {
  id: string;
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementIcon: string;
  achievementCategory: string;
  acquired: boolean;
  acquiredDate?: string;
  progressCurrent: number;
  progressTotal: number;
}

export interface WeeklyGoal {
  id: string;
  goalId: string;
  goalTitle: string;
  goalDescription: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  completed: boolean;
  reward?: string;
  weekStartDate: string;
  weekEndDate: string;
}

export interface GrowthData {
  level: number;
  experiencePoints: number;
  totalConversations: number;
  averageScore: number;
  streakDays: number;
  weeklyProgress: {
    conversations: number;
    totalScore: number;
    averageTime: number;
  };
  monthlyChallenges: {
    longestConversation: { time: number; persona: string; };
    mostLaughs: number;
    bestScore: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    user_gender?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  userGender: 'male' | 'female' | null;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ChatHistory {
  id: string;
  personaName: string;
  date: Date;
  score: number;
  isTutorial: boolean;
}