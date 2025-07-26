import React from 'react';
import { UserProfile, Persona } from '../types';
import { SimplifiedHomeScreenProps } from '../types/props';
import { SparklesIcon, ChevronRightIcon, UserIcon } from '../components/Icons';

const SimplifiedHomeScreen: React.FC<SimplifiedHomeScreenProps> = ({
  userProfile,
  recommendedPersonas,
  onNavigate,
  onSelectPersona,
  isTutorialCompleted,
  onStartTutorial,
  showTutorialCompletion
}) => {
  // 실제 userProfile 데이터 사용 (하드코딩 제거)
  const stats = {
    level: userProfile?.level || 1,
    experiencePoints: userProfile?.experiencePoints || 0,
    totalConversations: userProfile?.totalConversations || 0,
    averageScore: userProfile?.averageScore || 0,
    streakDays: userProfile?.streakDays || 0
  };

  const getLevelProgress = () => {
    const currentLevel = stats.level;
    const baseExp = (currentLevel - 1) * 100;
    const currentExp = stats.experiencePoints - baseExp;
    const nextLevelExp = currentLevel * 100;
    return Math.min((currentExp / nextLevelExp) * 100, 100);
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-purple-600';
    if (level >= 5) return 'text-blue-600';
    if (level >= 3) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-800">
              안녕하세요, {userProfile?.name || '사용자'}님!
            </h1>
            <p className="text-sm text-gray-600">오늘도 대화 실력을 키워보세요</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <UserIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Tutorial Completion Banner */}
        {showTutorialCompletion && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎉</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">튜토리얼 완료!</h3>
                <p className="text-sm opacity-90">첫 대화를 성공적으로 완료했습니다</p>
              </div>
              <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
                확인
              </button>
            </div>
          </div>
        )}

        {/* Level and Progress */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg ${getLevelColor(stats.level)}`}>
                {stats.level}
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold text-gray-800">레벨 {stats.level}</h2>
                <p className="text-sm text-gray-600">{stats.experiencePoints} XP</p>
              </div>
            </div>
            <SparklesIcon className="w-6 h-6 text-yellow-500" />
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 text-center">
            다음 레벨까지 {Math.max(0, (stats.level * 100) - stats.experiencePoints)} XP 필요
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 대화</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalConversations}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 점수</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageScore}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">연속 사용</p>
                <p className="text-2xl font-bold text-gray-800">{stats.streakDays}일</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-lg">🔥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">경험치</p>
                <p className="text-2xl font-bold text-gray-800">{stats.experiencePoints}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 시작</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('chat')}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">💬</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">대화 연습하기</p>
                  <p className="text-sm opacity-90">AI와 함께 대화 실력을 키워보세요</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5" />
            </button>

            {!isTutorialCompleted && (
              <button
                onClick={onStartTutorial}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">튜토리얼 시작</p>
                    <p className="text-sm opacity-90">첫 대화를 시작해보세요</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('coaching')}
              className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎓</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">AI 코칭</p>
                  <p className="text-sm opacity-90">개인 맞춤 대화 팁을 받아보세요</p>
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recommended Personas */}
        {recommendedPersonas.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">추천 페르소나</h3>
            <div className="space-y-3">
              {recommendedPersonas.map((persona) => (
                <div key={persona.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{persona.name}</h4>
                        <p className="text-sm text-gray-600">{persona.age}세 • {persona.job}</p>
                        <p className="text-xs text-gray-500">매칭률 {persona.matchRate}%</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPersona(persona)}
                      className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                    >
                      대화하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SimplifiedHomeScreen; 