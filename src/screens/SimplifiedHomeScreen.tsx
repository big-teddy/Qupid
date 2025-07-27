import React from 'react';
import { SimplifiedHomeScreenProps } from '../types/props';
import { ChevronRightIcon } from '../components/Icons';

const SimplifiedHomeScreen: React.FC<SimplifiedHomeScreenProps> = ({
  userProfile,
  recommendedPersonas,
  onNavigate,
  onSelectPersona,
  isTutorialCompleted,
  onStartTutorial,
  showTutorialCompletion
}) => {
  // 예시 데이터 (실제 데이터로 대체)
  const todayGoal = {
    total: 3,
    done: 2
  };
  const weeklyGrowth = {
    diff: 12,
    percent: 15,
    friendliness: 85,
    curiosity: 92,
    empathy: 78
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* 상단 인사말/프로필/알림/설정 */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2 bg-white">
        <div className="flex items-center">
          <img
            src={userProfile?.profile_image_url || '/profile-default.png'}
            alt="프로필"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">안녕하세요, {userProfile?.name || '사용자'}님!</h1>
            <p className="text-xs text-gray-400 mt-0.5">오늘도 대화 실력을 키워볼까요?</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-pink-400">
            <span className="material-symbols-outlined text-xl">notifications_none</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-pink-400" onClick={() => onNavigate('profile')}>
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-2 scrollable-content">
        {/* 튜토리얼 시작 카드 */}
        {!isTutorialCompleted && (
          <div className="bg-white rounded-2xl shadow-sm flex items-center px-5 py-4 mb-4">
            <span className="text-yellow-400 text-2xl mr-3">💡</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 mb-0.5">첫 대화 튜토리얼 시작하기</div>
              <div className="text-xs text-gray-400">가이드와 함께 대화의 기초를 익혀보세요.</div>
            </div>
            <button onClick={onStartTutorial} className="ml-2 text-gray-400 hover:text-pink-400">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 오늘의 목표 */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-5 py-4 mb-4 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-lg text-pink-400 mr-1">calendar_today</span>
              <span className="font-semibold text-gray-700 text-base">오늘의 목표</span>
            </div>
            <span className="text-xs text-pink-500 font-medium">1번 더 대화하면 목표 달성!</span>
          </div>
          <div className="text-2xl font-bold text-pink-400 mb-1">{todayGoal.done}/{todayGoal.total} 대화 완료</div>
          <div className="w-full h-2 bg-white bg-opacity-60 rounded-full mb-2">
            <div className="h-2 bg-pink-300 rounded-full transition-all duration-300" style={{ width: `${(todayGoal.done/todayGoal.total)*100}%` }}></div>
          </div>
          <button onClick={() => onNavigate('chat')} className="absolute right-5 top-4 bg-pink-400 text-white text-sm px-4 py-1.5 rounded-full font-semibold shadow hover:bg-pink-500 transition-all">바로 대화하기</button>
        </div>

        {/* 이번 주 성장 */}
        <div className="bg-white rounded-2xl px-5 py-4 mb-4 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-lg text-green-500 mr-1">insert_chart</span>
              <span className="font-semibold text-gray-700 text-base">이번 주 성장</span>
            </div>
            <button className="text-xs text-blue-500 font-medium">자세히 보기</button>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">+{weeklyGrowth.diff}점 향상 <span className="text-xs text-gray-400 font-normal ml-1">지난주 대비 +{weeklyGrowth.percent}%</span></div>
          <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
            <span>😊 친근함 {weeklyGrowth.friendliness}%</span>
            <span>🤔 호기심 {weeklyGrowth.curiosity}%</span>
            <span>💬 공감력 {weeklyGrowth.empathy}%</span>
          </div>
        </div>

        {/* 오늘의 추천 AI */}
        <div className="bg-white rounded-2xl px-5 py-4 mb-2">
          <div className="font-bold text-base text-gray-800 mb-1 flex items-center">💕 오늘의 추천 AI</div>
          <div className="text-xs text-gray-400 mb-3">지금 대화하기 좋은 친구들이에요</div>
          <div className="flex space-x-3 overflow-x-auto pb-1">
            {recommendedPersonas.map((persona) => (
              <div key={persona.id} className="min-w-[110px] max-w-[120px] bg-[#F8F9FB] rounded-xl flex flex-col items-center p-3 border border-gray-100 shadow-sm">
                <img src={persona.avatar || '/profile-default.png'} alt={persona.name} className="w-10 h-10 rounded-full object-cover mb-1" />
                <div className="font-semibold text-sm text-gray-800 mb-0.5">{persona.name}</div>
                <div className="text-xs text-green-500 flex items-center mb-1"><span className="w-2 h-2 bg-green-400 rounded-full mr-1 inline-block"></span>온라인</div>
                <button onClick={() => onSelectPersona(persona)} className="w-full bg-pink-100 text-pink-500 text-xs rounded-full py-1 font-semibold mt-1 hover:bg-pink-200 transition-all">대화하기</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimplifiedHomeScreen; 