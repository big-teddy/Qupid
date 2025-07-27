
import React from 'react';
import { UserProfile, Persona, Screen } from '../types';
import { PREDEFINED_PERSONAS } from '../constants';
import { SearchIcon, BellIcon, SettingsIcon, CalendarDaysIcon, ChartTrendingUpIcon, BookmarkSquareIcon, TrophyIcon, ChevronRightIcon, TargetIcon, LightbulbIcon } from './Icons';

interface HomeScreenProps {
  userProfile: UserProfile;
  isTutorialCompleted: boolean;
  onNavigate: (screen: Screen) => void;
  onSelectPersona: (persona: Persona) => void;
  onStartTutorial: () => void;
}

const TossStyleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-[#F2F4F6] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${onClick ? 'cursor-pointer transition-transform hover:-translate-y-0.5' : ''} ${className}`}
  >
    {children}
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ userProfile, isTutorialCompleted, onNavigate, onSelectPersona, onStartTutorial }) => {

  const partnerGender = userProfile?.userGender === 'female' ? 'male' : 'female';
  const recommendedPersonas = PREDEFINED_PERSONAS.filter(p => p.gender === partnerGender);
  
  const quickActions = [
    { title: '즐겨찾기와 대화', icon: <BookmarkSquareIcon className="w-6 h-6 text-[#DB7093]" />, bgColor: 'bg-[#FDF2F8]', screen: Screen.Favorites },
    { title: '맞춤 연습', icon: <TargetIcon className="w-6 h-6 text-[#4F7ABA]" />, bgColor: 'bg-[#EBF2FF]', screen: Screen.PersonaSelection },
    { title: '성장 기록', icon: <ChartTrendingUpIcon className="w-6 h-6 text-[#059682]" />, bgColor: 'bg-[#F0FDF9]', screen: Screen.PerformanceDetail },
    { title: '내 배지', icon: <TrophyIcon className="w-6 h-6 text-[#E67800]" />, bgColor: 'bg-[#FFF4E6]', screen: Screen.Badges },
  ];
  
  return (
    <div className="flex flex-col h-full w-full bg-[#F9FAFB]">
      {/* Header */}
      <header className="flex-shrink-0 p-5 pt-6 bg-white">
        <div className="flex items-center">
          <img src="https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/user.png" alt="profile" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <h1 className="text-xl font-bold text-[#191F28]">안녕하세요, {userProfile.name}님!</h1>
            <p className="text-sm text-[#8B95A1]">오늘도 대화 실력을 키워볼까요?</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100"><BellIcon className="w-6 h-6 text-[#8B95A1]" /></button>
            <button onClick={() => onNavigate(Screen.Settings)} className="p-2 rounded-full hover:bg-gray-100"><SettingsIcon className="w-6 h-6 text-[#8B95A1]" /></button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 space-y-4">
        
        {/* Tutorial Card for new users */}
        {!isTutorialCompleted && (
            <TossStyleCard onClick={onStartTutorial} className="bg-gradient-to-br from-[#FDF2F8] to-[#EBF2FF]">
                 <div className="flex items-center">
                    <p className="text-4xl">💡</p>
                    <div className="ml-4 flex-1">
                        <p className="font-bold text-base text-[#191F28]">첫 대화 튜토리얼 시작하기</p>
                        <p className="text-sm text-[#8B95A1]">가이드와 함께 대화의 기초를 익혀보세요.</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-[#8B95A1]"/>
                </div>
            </TossStyleCard>
        )}

        {/* Today Card */}
        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 flex items-center">
            <div className="flex-1">
                <p className="font-bold text-lg text-[#191F28] flex items-center"><CalendarDaysIcon className="w-5 h-5 mr-2"/>오늘의 목표</p>
                <p className="font-bold text-2xl text-[#F093B0] mt-2">2/3 대화 완료</p>
                <div className="w-full bg-white/50 h-1.5 rounded-full mt-2">
                    <div className="bg-[#F093B0] h-1.5 rounded-full" style={{width: '66%'}}></div>
                </div>
            </div>
            <div className="ml-4 text-right flex-shrink-0">
                <p className="text-sm font-medium text-[#4F7ABA]">1번 더 대화하면<br/>목표 달성!</p>
                <button onClick={() => onNavigate(Screen.PersonaSelection)} className="mt-2 px-4 py-2 bg-[#F093B0] text-white text-sm font-bold rounded-full">바로 대화하기</button>
            </div>
        </div>
        
        {/* Performance Card */}
        <TossStyleCard onClick={() => onNavigate(Screen.PerformanceDetail)}>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#191F28]">📊 이번 주 성장</h2>
                <span className="text-sm font-medium text-[#4F7ABA] flex items-center">자세히 보기 <ChevronRightIcon className="w-4 h-4"/></span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
                <p className="text-3xl font-black text-[#0AC5A8]">+12점 향상</p>
                <p className="text-sm font-medium text-[#8B95A1]">지난주 대비 +15%</p>
            </div>
             <p className="mt-2 text-xs text-[#8B95A1]">😊 친근함 85% | 🤔 호기심 92% | 💬 공감력 78%</p>
        </TossStyleCard>

        {/* Recommended AI Card */}
        <TossStyleCard>
            <h2 className="text-lg font-bold text-[#191F28]">💕 오늘의 추천 AI</h2>
            <p className="text-sm text-[#8B95A1]">지금 대화하기 좋은 친구들이에요</p>
            <div className="mt-4 flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
                {recommendedPersonas.slice(0, 4).map(p => (
                    <div key={p.id} onClick={() => onSelectPersona(p)} className="flex-shrink-0 w-32 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB] cursor-pointer">
                        <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full mx-auto object-cover"/>
                        <p className="mt-2 text-center font-bold text-sm text-[#191F28] truncate">{p.name}</p>
                        <p className="text-center text-xs text-[#0AC5A8] font-semibold">🟢 온라인</p>
                    </div>
                ))}
                <div onClick={() => onNavigate(Screen.PersonaSelection)} className="flex-shrink-0 w-32 p-3 bg-[#F2F4F6] rounded-xl border border-dashed border-[#B0B8C1] flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center"><ChevronRightIcon className="w-8 h-8 text-[#B0B8C1]"/></div>
                    <p className="mt-2 text-center font-bold text-sm text-[#8B95A1]">전체 보기</p>
                </div>
            </div>
        </TossStyleCard>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(action => (
            <div key={action.title} onClick={() => onNavigate(action.screen)} className={`p-4 rounded-xl flex items-center cursor-pointer ${action.bgColor}`}>
              {action.icon}
              <p className="ml-3 font-bold text-sm text-gray-800">{action.title}</p>
            </div>
          ))}
        </div>
        
        {/* Achievement Banner */}
        <div onClick={() => onNavigate(Screen.Badges)} className="bg-gradient-to-r from-[#F7F4FF] to-[#FDF2F8] rounded-xl p-4 flex items-center cursor-pointer">
            <p className="text-4xl">🏆</p>
            <div className="ml-4 flex-1">
                <p className="font-bold text-base text-[#191F28]">새로운 배지 획득!</p>
                <p className="text-sm text-[#8B95A1]">'꾸준함의 달인' 배지를 확인해보세요.</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-[#8B95A1]"/>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
