
import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import ChatScreen from './screens/ChatScreen';
import PersonaSelection from './screens/PersonaSelection';
import PersonaDetailScreen from './screens/PersonaDetailScreen';
import ConversationPrepScreen from './screens/ConversationPrepScreen';
import ConversationAnalysisScreen from './screens/ConversationAnalysisScreen';
import HomeScreen from './screens/HomeScreen';
import SimplifiedHomeScreen from './screens/SimplifiedHomeScreen';
import ChatTabScreen from './screens/ChatTabScreen';
import AICoachingScreen from './screens/AICoachingScreen';
import PerformanceDetailScreen from './screens/PerformanceDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BadgesScreen from './screens/BadgesScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import LearningGoalsScreen from './screens/LearningGoalsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import DataExportScreen from './screens/DataExportScreen';
import DeleteAccountScreen from './screens/DeleteAccountScreen';
import { OnboardingFlow } from './screens/OnboardingFlow';
import CustomPersonaForm from './components/CustomPersonaForm';
import DatabaseTest from './components/DatabaseTest';
import BottomTabBar from './components/BottomTabBar';
import { Persona, Screen, UserProfile, ConversationAnalysis } from './types/index';
import { PREDEFINED_PERSONAS, PERFORMANCE_DATA, BADGES_DATA } from './constants/index';
import useLocalStorage from './hooks/useLocalStorage';
import { addPersona, getPersonas } from './services/personaService';

type AppState = 'splash' | 'onboarding' | 'main';

const SplashScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-white animate-fade-in">
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4 animate-scale-in">💕</div>
      <h1 className="text-2xl font-bold animate-fade-in-up delay-100" style={{ color: 'var(--text-primary)' }}>연애 박사</h1>
    </div>
    <div className="mb-24">
      <p className="text-base animate-fade-in-up delay-200" style={{ color: 'var(--text-secondary)' }}>AI와 함께하는 대화 연습</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [isTutorialCompleted, setIsTutorialCompleted] = useLocalStorage<boolean>('tutorialCompleted', false);
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage<boolean>('onboardingComplete', false);
  const [analysisResult, setAnalysisResult] = useState<ConversationAnalysis | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['f1', 'm2']);
  const [isChatInTutorialMode, setIsChatInTutorialMode] = useState(false);
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaError, setPersonaError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('home');
  const [showTutorialCompletion, setShowTutorialCompletion] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setAppState('main');
      setCurrentScreen(Screen.Home);
    } else {
      setAppState('onboarding');
    }
  }, []);

  // Fetch personas from Supabase on userProfile load
  useEffect(() => {
    if (userProfile && userProfile.id) {
      setPersonaLoading(true);
      getPersonas(userProfile.id)
        .then(data => setCustomPersonas(data || []))
        .catch(err => setPersonaError('페르소나 불러오기 실패'))
        .finally(() => setPersonaLoading(false));
    }
  }, [userProfile]);

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    setOnboardingComplete(true);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
    setAppState('main');
    setCurrentScreen(Screen.Home);
  }, [setOnboardingComplete, setUserProfile]);
  
  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const handlePersonaSelect = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setCurrentScreen(Screen.ConversationPrep);
  }, []);
  
  const handleStartPrep = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setIsChatInTutorialMode(false);
    setCurrentScreen(Screen.ConversationPrep);
  }, []);

    const handleStartTutorial = useCallback(() => {
    const tutorialPersona = PREDEFINED_PERSONAS.find(p => p.id === 'f1');
    if(tutorialPersona) {
      setSelectedPersona(tutorialPersona);
      setIsChatInTutorialMode(true);
      setCurrentScreen(Screen.Chat);
    }
  }, []);

  const handleStartChat = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setCurrentScreen(Screen.Chat);
  }, []);

  const handleCompleteChat = useCallback((analysis: ConversationAnalysis | null) => {
    if (isChatInTutorialMode) {
        localStorage.setItem('tutorialCompleted', 'true');
        setIsTutorialCompleted(true);
        setIsChatInTutorialMode(false);
        // 튜토리얼 완료 후 홈 화면으로 이동하고 완료 카드 표시
        setActiveTab('home');
        setCurrentScreen(Screen.Home);
        setShowTutorialCompletion(true);
        // 5초 후 완료 카드 숨기기
        setTimeout(() => setShowTutorialCompletion(false), 5000);
        return;
    }
    setAnalysisResult(analysis);
    setCurrentScreen(Screen.ConversationAnalysis);
  }, [isChatInTutorialMode]);

  const handleBackToHome = useCallback(() => {
    setSelectedPersona(null);
    setAnalysisResult(null);
    setActiveTab('home');
    setCurrentScreen(Screen.Home);
  }, []);
  
  const handleBackToSelection = useCallback(() => {
    setSelectedPersona(null);
    setCurrentScreen(Screen.PersonaSelection);
  }, []);
  
  const handleBackFromPrep = useCallback(() => {
      setCurrentScreen(Screen.PersonaSelection);
  }, []);

  const handleCreateCustomPersona = async (data: any) => {
    if (!userProfile || !userProfile.id) return;
    setPersonaLoading(true);
    setPersonaError(null);
    try {
      const newPersona: Omit<Persona, 'id' | 'created_at'> = {
        user_id: userProfile.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        job: data.job,
        mbti: data.mbti,
        intro: data.intro,
        avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/user.png',
        matchRate: 99,
        personalityTraits: data.personalityTraits && data.personalityTraits.length > 0 ? data.personalityTraits : ['직접 설정'],
        interests: (data.interests || []).map((topic: string) => ({ topic, emoji: '✨', description: '' })),
        tags: ['맞춤'],
        conversationPreview: [{ text: '안녕하세요! 나만의 맞춤 페르소나입니다.' }],
        custom: true,
        description: data.intro,
      };
      const created = await addPersona(newPersona);
      setCustomPersonas(prev => [...prev, created]);
      setSelectedPersona(created);
      setCurrentScreen(Screen.ConversationPrep);
    } catch (err) {
      setPersonaError('페르소나 생성 실패');
    } finally {
      setPersonaLoading(false);
    }
  };

  const toggleFavorite = useCallback((personaId: string) => {
    setFavoriteIds(prev => 
      prev.includes(personaId) 
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
  }, []);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNavigate = useCallback((screen: string) => {
    if (screen === 'persona-selection') {
      setCurrentScreen(Screen.PersonaSelection);
    }
  }, []);

  // Get recommended personas based on user gender
  const getRecommendedPersonas = () => {
    const partnerGender = userProfile?.userGender === 'female' ? 'male' : 'female';
    return PREDEFINED_PERSONAS.filter(p => p.gender === partnerGender).slice(0, 1);
  };

  // Get favorite personas
  const getFavoritePersonas = () => {
    return PREDEFINED_PERSONAS.filter(p => favoriteIds.includes(p.id));
  };

  // Render tab content
  const renderTabContent = () => {
    if (!userProfile) return null;

    switch (activeTab) {
      case 'home':
        return (
          <SimplifiedHomeScreen
            userProfile={userProfile}
            onNavigate={(screen) => {
              if (screen === 'chat') setActiveTab('chat');
              else if (screen === 'coaching') setActiveTab('coaching');
              else if (screen === 'settings') setActiveTab('profile');
              else if (screen === 'profile') setActiveTab('profile');
            }}
            onSelectPersona={handlePersonaSelect}
            recommendedPersonas={getRecommendedPersonas()}
            isTutorialCompleted={isTutorialCompleted}
            onStartTutorial={handleStartTutorial}
            showTutorialCompletion={showTutorialCompletion}
          />
        );

      case 'chat':
        return (
          <ChatTabScreen
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onSelectPersona={handlePersonaSelect}
            onCreateCustomPersona={() => setCurrentScreen(Screen.CustomPersonaForm)}
            personas={[...customPersonas, ...PREDEFINED_PERSONAS]}
          />
        );

      case 'coaching':
        return (
          <AICoachingScreen
            userProfile={userProfile}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
          />
        );

      case 'profile':
        return (
          <SettingsScreen
            userProfile={userProfile}
            onNavigate={navigateTo}
            onBack={() => setActiveTab('home')}
          />
        );

      default:
        return (
          <SimplifiedHomeScreen
            userProfile={userProfile}
            onNavigate={(screen) => {
              if (screen === 'chat') setActiveTab('chat');
              else if (screen === 'coaching') setActiveTab('coaching');
              else if (screen === 'settings') setActiveTab('profile');
              else if (screen === 'profile') setActiveTab('profile');
            }}
            onSelectPersona={handlePersonaSelect}
            recommendedPersonas={getRecommendedPersonas()}
            isTutorialCompleted={isTutorialCompleted}
            onStartTutorial={handleStartTutorial}
            showTutorialCompletion={showTutorialCompletion}
          />
        );
    }
  };

  const renderMainApp = () => {
    if (!userProfile) return null;

    // If we're in a specific screen that's not tab-based, render that
    if (currentScreen === Screen.PersonaSelection) {
      return (
        <PersonaSelection
          personas={[...customPersonas, ...PREDEFINED_PERSONAS]}
          userProfile={userProfile}
          onSelect={handlePersonaSelect}
          onBack={() => setActiveTab('chat')}
          onCreateCustomPersona={() => setCurrentScreen(Screen.CustomPersonaForm)}
          onSelectCustomPersona={persona => { setSelectedPersona(persona); setCurrentScreen(Screen.ConversationPrep); }}
        />
      );
    }

    if (currentScreen === Screen.Chat && selectedPersona) {
      return (
        <ChatScreen
          persona={selectedPersona}
          isTutorial={isChatInTutorialMode}
          onComplete={handleCompleteChat}
          onBack={() => setCurrentScreen(Screen.ConversationPrep)}
        />
      );
    }

    if (currentScreen === Screen.ConversationAnalysis) {
      return (
        <ConversationAnalysisScreen
          analysis={analysisResult!}
          persona={selectedPersona!}
          onNext={handleBackToHome}
          onBack={() => setCurrentScreen(Screen.Chat)}
        />
      );
    }

    if (currentScreen === Screen.ConversationPrep) {
      return (
        <ConversationPrepScreen
          persona={selectedPersona!}
          onStart={() => handleStartChat(selectedPersona!)}
          onBack={handleBackFromPrep}
        />
      );
    }

    if (currentScreen === Screen.CustomPersonaForm) {
      return (
        <CustomPersonaForm
          onCreate={handleCreateCustomPersona}
          onBack={() => setActiveTab('chat')}
        />
      );
    }

    if (currentScreen === Screen.DatabaseTest) {
      return <DatabaseTest />;
    }

    // Tab-based content
    return renderTabContent();
  };

  const renderContent = () => {
    switch(appState) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'main':
        return (
          <div className="flex flex-col h-full relative">
            <div className="flex-1 flex flex-col min-h-0 animate-fade-in overflow-hidden">
              {renderMainApp()}
            </div>
            
            {/* Bottom tab bar - hide for specific screens */}
            {currentScreen !== Screen.Chat &&
             currentScreen !== Screen.ConversationAnalysis &&
             currentScreen !== Screen.ConversationPrep &&
             currentScreen !== Screen.CustomPersonaForm &&
             currentScreen !== Screen.DatabaseTest && (
              <BottomTabBar
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            )}
          </div>
        );
      default:
        return <SplashScreen />;
    }
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center font-sans">
      <div 
        className="w-full h-full sm:max-w-[430px] sm:h-[90vh] sm:max-h-[932px] sm:rounded-[2.5rem] shadow-2xl mobile-container bg-white" 
      >
        <div className="mobile-content flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
