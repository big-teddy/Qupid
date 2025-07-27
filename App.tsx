
import React, { useState, useCallback, useEffect } from 'react';
import ChatScreen from './components/ChatScreen';
import PersonaSelection from './components/PersonaSelection';
import PersonaDetailScreen from './components/PersonaDetailScreen';
import ConversationPrepScreen from './components/ConversationPrepScreen';
import ConversationAnalysisScreen from './components/ConversationAnalysisScreen';
import HomeScreen from './components/HomeScreen';
import PerformanceDetailScreen from './components/PerformanceDetailScreen';
import FavoritesScreen from './components/FavoritesScreen';
import BadgesScreen from './components/BadgesScreen';
import SettingsScreen from './components/SettingsScreen';
import ProfileEditScreen from './components/ProfileEditScreen';
import LearningGoalsScreen from './components/LearningGoalsScreen';
import NotificationSettingsScreen from './components/NotificationSettingsScreen';
import DataExportScreen from './components/DataExportScreen';
import DeleteAccountScreen from './components/DeleteAccountScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Persona, Screen, UserProfile, ConversationAnalysis } from './types';
import { PREDEFINED_PERSONAS, PERFORMANCE_DATA, BADGES_DATA } from './constants';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ConversationAnalysis | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['f1', 'm2']);
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(false);
  const [isChatInTutorialMode, setIsChatInTutorialMode] = useState(false);


  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const savedProfile = localStorage.getItem('userProfile');
    const tutorialComplete = localStorage.getItem('tutorialCompleted');

    const timer = setTimeout(() => {
      if (onboardingComplete && savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setIsTutorialCompleted(tutorialComplete === 'true');
        setCurrentScreen(Screen.Home);
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
    setAppState('main');
    setCurrentScreen(Screen.Home);
  }, []);
  
  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const handlePersonaSelect = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    navigateTo(Screen.PersonaDetail);
  }, [navigateTo]);
  
  const handleStartPrep = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setIsChatInTutorialMode(false);
    navigateTo(Screen.ConversationPrep);
  }, [navigateTo]);

  const handleStartTutorial = useCallback(() => {
    const tutorialPersona = PREDEFINED_PERSONAS.find(p => p.id === 'f1'); // Use Soyeon for tutorial
    if(tutorialPersona) {
        setSelectedPersona(tutorialPersona);
        setIsChatInTutorialMode(true);
        navigateTo(Screen.Chat);
    }
  }, [navigateTo]);

  const handleStartChat = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    navigateTo(Screen.Chat);
  }, [navigateTo]);

  const handleCompleteChat = useCallback((analysis: ConversationAnalysis | null) => {
    if (isChatInTutorialMode) {
        localStorage.setItem('tutorialCompleted', 'true');
        setIsTutorialCompleted(true);
        setIsChatInTutorialMode(false);
    }
    setAnalysisResult(analysis);
    navigateTo(Screen.ConversationAnalysis);
  }, [navigateTo, isChatInTutorialMode]);

  const handleBackToHome = useCallback(() => {
    setSelectedPersona(null);
    setAnalysisResult(null);
    navigateTo(Screen.Home);
  }, [navigateTo]);
  
  const handleBackToSelection = useCallback(() => {
    setSelectedPersona(null);
    navigateTo(Screen.PersonaSelection);
  }, [navigateTo]);
  
  const handleBackFromPrep = useCallback(() => {
      if (selectedPersona) {
        handlePersonaSelect(selectedPersona);
      } else {
        navigateTo(Screen.PersonaSelection);
      }
  }, [selectedPersona, handlePersonaSelect, navigateTo]);


  const toggleFavorite = useCallback((personaId: string) => {
    setFavoriteIds(prev => 
      prev.includes(personaId) 
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
  }, []);

  const renderMainApp = () => {
    if (!userProfile) return <SplashScreen />; // Should not happen in 'main' state

    switch (currentScreen) {
      case Screen.Home:
        return <HomeScreen 
                  userProfile={userProfile}
                  onNavigate={navigateTo}
                  onSelectPersona={handlePersonaSelect}
                  isTutorialCompleted={isTutorialCompleted}
                  onStartTutorial={handleStartTutorial}
                />;
      case Screen.PersonaSelection:
        return (
          <PersonaSelection
            personas={PREDEFINED_PERSONAS}
            userProfile={userProfile}
            onSelect={handlePersonaSelect}
            onBack={handleBackToHome}
          />
        );
      case Screen.PersonaDetail:
        return selectedPersona && <PersonaDetailScreen 
                                    persona={selectedPersona} 
                                    onStartChat={handleStartPrep} 
                                    onBack={handleBackToSelection} 
                                    isFavorite={favoriteIds.includes(selectedPersona.id)}
                                    onToggleFavorite={toggleFavorite}
                                  />;
      case Screen.ConversationPrep:
        return selectedPersona && <ConversationPrepScreen 
                                    persona={selectedPersona} 
                                    onStart={() => handleStartChat(selectedPersona)} 
                                    onBack={handleBackFromPrep} />;
      case Screen.Chat:
        return selectedPersona && <ChatScreen 
                                    persona={selectedPersona}
                                    isTutorial={isChatInTutorialMode}
                                    onComplete={handleCompleteChat} />;
      case Screen.ConversationAnalysis:
        return analysisResult && selectedPersona && <ConversationAnalysisScreen 
                                                        analysis={analysisResult} 
                                                        persona={selectedPersona} 
                                                        onNext={handleBackToHome} />;
      case Screen.PerformanceDetail:
        return <PerformanceDetailScreen 
                  data={PERFORMANCE_DATA}
                  onBack={handleBackToHome}
                />;
      case Screen.Favorites:
        const favoritePersonas = PREDEFINED_PERSONAS.filter(p => favoriteIds.includes(p.id));
        return <FavoritesScreen 
                  personas={favoritePersonas}
                  onSelectPersona={handlePersonaSelect}
                  onBack={handleBackToHome}
                />;
      case Screen.Badges:
         return <BadgesScreen 
                   badges={BADGES_DATA}
                   onBack={handleBackToHome}
                 />;
      case Screen.Settings:
        return <SettingsScreen
                  userProfile={userProfile}
                  onNavigate={navigateTo}
                  onBack={handleBackToHome}
                />;
      case Screen.ProfileEdit:
        return <ProfileEditScreen
                  userProfile={userProfile}
                  onBack={() => navigateTo(Screen.Settings)}
                />;
      case Screen.LearningGoals:
        return <LearningGoalsScreen onBack={() => navigateTo(Screen.Settings)} />;
      case Screen.NotificationSettings:
        return <NotificationSettingsScreen onBack={() => navigateTo(Screen.Settings)} />;
      case Screen.DataExport:
        return <DataExportScreen onBack={() => navigateTo(Screen.Settings)} />;
      case Screen.DeleteAccount:
        return <DeleteAccountScreen 
                    onBack={() => navigateTo(Screen.Settings)} 
                    onComplete={handleBackToHome} 
                />;
      default:
        return <HomeScreen 
                  userProfile={userProfile}
                  onNavigate={navigateTo}
                  onSelectPersona={handlePersonaSelect}
                  isTutorialCompleted={isTutorialCompleted}
                  onStartTutorial={handleStartTutorial}
                />;
    }
  };

  const renderContent = () => {
    switch(appState) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'main':
        return (
          <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
            {renderMainApp()}
          </div>
        );
      default:
        return <SplashScreen />;
    }
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center font-sans">
      <div 
        className="w-full h-full sm:max-w-[430px] sm:h-[90vh] sm:max-h-[932px] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative" 
        style={{ backgroundColor: 'var(--surface)'}}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
