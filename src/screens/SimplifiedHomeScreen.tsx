import * as React from 'react';
import { CalendarDaysIcon, ChevronRightIcon, BellIcon, SettingsIcon, LightbulbIcon, TrophyIcon, TargetIcon } from '../components/Icons';
import { UserProfile, Persona, Achievement, WeeklyGoal } from '../types';
import { ACHIEVEMENTS, WEEKLY_GOALS } from '../constants';

interface SimplifiedHomeScreenProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: string) => void;
  onSelectPersona: (persona: Persona) => void;
  recommendedPersonas: Persona[];
  isTutorialCompleted: boolean;
  onStartTutorial: () => void;
  showTutorialCompletion?: boolean;
}

const SimplifiedHomeScreen: React.FC<SimplifiedHomeScreenProps> = ({ 
  userProfile, 
  onNavigate, 
  onSelectPersona, 
  recommendedPersonas,
  isTutorialCompleted,
  onStartTutorial,
  showTutorialCompletion = false
}) => {
  // Mock data - 실제로는 DB에서 가져올 데이터
  const todayGoal = {
    completed: 2,
    target: 3,
    progress: 66
  };

  const weeklyGrowth = {
    score: 12,
    percentage: 18
  };

  const hasNewAchievement = true;

  // 사용자 성장 데이터 (실제로는 userProfile에서 가져올 데이터)
  const growthData = {
    level: userProfile?.level || 3,
    experiencePoints: userProfile?.experiencePoints || 750,
    totalConversations: userProfile?.totalConversations || 15,
    averageScore: userProfile?.averageScore || 78,
    streakDays: userProfile?.streakDays || 5
  };

  // 최근 획득한 성취 (실제로는 DB에서 가져올 데이터)
  const recentAchievements = ACHIEVEMENTS.filter(a => a.acquired).slice(0, 2);

  // 주간 목표 진행 상황 (실제로는 DB에서 가져올 데이터)
  const weeklyGoals = WEEKLY_GOALS.map(goal => ({
    ...goal,
    current: goal.id === 'conversations_5' ? 2 : goal.id === 'score_80' ? 78 : 45
  }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              안녕하세요, {userProfile?.name}님! 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1">오늘도 대화 실력을 키워볼까요?</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <button 
              onClick={() => onNavigate('settings')} 
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <SettingsIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Tutorial Card for new users */}
          {!isTutorialCompleted && (
            <div 
              onClick={onStartTutorial}
              className="bg-gradient-to-br from-[#FDF2F8] to-[#EBF2FF] rounded-2xl p-6 border border-[#F093B0] cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#F093B0] rounded-full flex items-center justify-center mr-4">
                  <LightbulbIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">🎯 첫 대화 연습하기</h3>
                  <p className="text-sm text-gray-600">5분만에 기본 대화법을 배워보세요</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-[#F093B0] rounded-full mr-2"></span>
                  AI와 안전한 대화 연습
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-[#F093B0] rounded-full mr-2"></span>
                  실시간 피드백 제공
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-[#F093B0] rounded-full mr-2"></span>
                  대화 실력 향상 팁
                </div>
              </div>
              <button className="w-full bg-[#F093B0] text-white font-bold py-3 rounded-xl hover:bg-[#E085A0] transition-colors">
                튜토리얼 시작하기
              </button>
            </div>
          )}

          {/* Tutorial Completion Card */}
          {showTutorialCompletion && (
            <div className="bg-gradient-to-br from-[#E6F9F6] to-[#F0FFF4] rounded-2xl p-6 border border-[#0AC5A8] animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#0AC5A8] rounded-full flex items-center justify-center mr-4">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">🎉 튜토리얼 완료!</h3>
                  <p className="text-sm text-gray-600">첫 대화 연습을 성공적으로 마쳤습니다</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">획득한 경험치</span>
                  <span className="font-bold text-[#0AC5A8]">+50 XP</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">새로운 성취</span>
                  <span className="font-bold text-[#0AC5A8]">첫 대화 💬</span>
                </div>
              </div>
            </div>
          )}

          {/* User Level & Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Level {growthData.level}</h3>
                <p className="text-sm text-gray-600">대화 중급자</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">경험치</p>
                <p className="text-lg font-bold text-[#F093B0]">{growthData.experiencePoints} XP</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>다음 레벨까지</span>
                <span>{growthData.experiencePoints % 1000}/1000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#F093B0] to-[#DB7093] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(growthData.experiencePoints % 1000) / 10}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{growthData.totalConversations}</p>
                <p className="text-xs text-gray-600">총 대화</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{growthData.averageScore}</p>
                <p className="text-xs text-gray-600">평균 점수</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{growthData.streakDays}</p>
                <p className="text-xs text-gray-600">연속 일수</p>
              </div>
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">이번 주 목표</h3>
              <TargetIcon className="w-5 h-5 text-[#F093B0]" />
            </div>
            
            <div className="space-y-4">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">{goal.title}</span>
                      {goal.completed && (
                        <span className="ml-2 text-xs bg-[#0AC5A8] text-white px-2 py-1 rounded-full">
                          완료
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>{goal.description}</span>
                      <span>{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#F093B0] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">최근 성취</h3>
                <button 
                  onClick={() => onNavigate('badges')}
                  className="text-sm text-[#F093B0] font-medium"
                >
                  모두 보기
                </button>
              </div>
              
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] rounded-xl">
                    <div className="w-10 h-10 bg-[#F093B0] rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-xs text-[#F093B0] font-medium">
                      {achievement.acquiredDate && '방금 전'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Recommended AI */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">오늘의 추천 AI</h3>
              <button 
                onClick={() => onNavigate('chat')}
                className="text-sm text-[#F093B0] font-medium"
              >
                모두 보기
              </button>
            </div>
            
            {recommendedPersonas.length > 0 ? (
              <div 
                onClick={() => onSelectPersona(recommendedPersonas[0])}
                className="flex items-center p-4 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] rounded-xl cursor-pointer hover:shadow-md transition-shadow border border-[#F093B0]"
              >
                <img
                  src={recommendedPersonas[0].avatar}
                  alt={recommendedPersonas[0].name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">
                    {recommendedPersonas[0].name}, {recommendedPersonas[0].age}세
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{recommendedPersonas[0].intro}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#F093B0]">
                      {recommendedPersonas[0].matchRate}% 매칭
                    </span>
                    <div className="flex space-x-1">
                      {recommendedPersonas[0].tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>추천 AI를 준비 중입니다...</p>
              </div>
            )}
          </div>

          {/* New Badge Banner */}
          {hasNewAchievement && (
            <div className="bg-gradient-to-r from-[#B794F6] to-[#9F7AEA] rounded-2xl p-6 text-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">새로운 배지 획득!</h3>
                  <p className="text-sm opacity-90">대화 지속왕 배지를 획득했습니다</p>
                </div>
                <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SimplifiedHomeScreen; 