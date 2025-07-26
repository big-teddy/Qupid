
export interface Persona {
  id: string;
  user_id: string;
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
  userGender: 'male' | 'female' | null;
  experience: string | null;
  confidence: string | null;
  difficulty: string | null;
  interests: string[];
  level: number; // 사용자 레벨 (1-10)
  experiencePoints: number; // 경험치
  totalConversations: number; // 총 대화 수
  averageScore: number; // 평균 점수
  streakDays: number; // 연속 사용 일수
  lastActiveDate: string; // 마지막 활동일
}

export interface ConversationAnalysis {
    totalScore: number;
    feedback: string;
    friendliness: { score: number; feedback: string };
    curiosity: { score: number; feedback: string };
    empathy: { score: number; feedback: string };
    positivePoints: string[];
    pointsToImprove: { topic: string; suggestion: string }[];
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
  icon: string;
  name: string;
  description: string;
  category: '대화' | '성장' | '특별';
  rarity: 'Common' | 'Rare' | 'Epic';
  acquired: boolean;
  progress?: { current: number; total: number; };
  featured?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: '대화' | '성장' | '특별' | '연속';
  acquired: boolean;
  acquiredDate?: string;
  progress?: { current: number; total: number; };
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string; // '회', '분', '점' 등
  category: '대화' | '점수' | '시간';
  completed: boolean;
  reward?: string;
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