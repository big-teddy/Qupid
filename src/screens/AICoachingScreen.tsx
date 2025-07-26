import * as React from 'react';
import { useState } from 'react';
import { ChevronRightIcon, TargetIcon, ChartBarIcon, UserIcon, SparklesIcon } from '../components/Icons';
import { UserProfile } from '../types';

interface AICoachingScreenProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: string) => void;
}

const AICoachingScreen: React.FC<AICoachingScreenProps> = ({ userProfile, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'analysis' | 'goals' | 'consultation'>('overview');

  // Mock data - 실제로는 DB에서 가져올 데이터
  const performanceData = {
    totalScore: 78,
    growth: 12,
    growthRate: 18,
    goalAchievement: 85,
    areas: [
      { name: '친근함', score: 85, change: 8, trend: 'up' },
      { name: '호기심', score: 92, change: 15, trend: 'up' },
      { name: '공감력', score: 58, change: 3, trend: 'up' },
      { name: '자신감', score: 72, change: -2, trend: 'down' }
    ]
  };

  const goals = [
    { id: 1, title: '이번 주 5번 대화하기', progress: 3, target: 5, status: 'in-progress' },
    { id: 2, title: '공감력 70점 달성', progress: 58, target: 70, status: 'in-progress' },
    { id: 3, title: '새로운 AI 3명과 대화', progress: 2, target: 3, status: 'in-progress' }
  ];

  const consultationTopics = [
    { id: 1, title: '첫인상 개선하기', description: '상대방에게 좋은 첫인상을 남기는 방법', icon: '💫' },
    { id: 2, title: '대화 주제 찾기', description: '어색함 없이 대화할 수 있는 주제들', icon: '💬' },
    { id: 3, title: '관심 표현하기', description: '상대방에게 진심 어린 관심을 표현하는 방법', icon: '❤️' },
    { id: 4, title: '데이트 제안하기', description: '자연스럽게 데이트를 제안하는 팁', icon: '📅' },
    { id: 5, title: '관계 발전시키기', description: '친구에서 연인으로 관계를 발전시키는 방법', icon: '🌱' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 성과 요약 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">이번 주 성과</h2>
          <span className="text-sm text-gray-500">주간 리포트</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F093B0]">{performanceData.totalScore}</div>
            <div className="text-sm text-gray-600">총점</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0AC5A8]">+{performanceData.growth}</div>
            <div className="text-sm text-gray-600">성장</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">목표 달성률</span>
          <span className="font-semibold text-[#4F7ABA]">{performanceData.goalAchievement}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-[#4F7ABA] h-2 rounded-full transition-all duration-300" 
            style={{ width: `${performanceData.goalAchievement}%` }}
          ></div>
        </div>
      </div>

      {/* 영역별 분석 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">영역별 분석</h2>
        <div className="space-y-3">
          {performanceData.areas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <span className="text-lg mr-3">{area.trend === 'up' ? '📈' : '📉'}</span>
                <div>
                  <div className="font-semibold text-gray-800">{area.name}</div>
                  <div className="text-sm text-gray-600">
                    {area.trend === 'up' ? '+' : ''}{area.change}점 변화
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#F093B0]">{area.score}</div>
                <div className="text-xs text-gray-500">점수</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 목표 현황 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">목표 현황</h2>
          <button 
            onClick={() => setActiveSection('goals')}
            className="text-sm text-[#F093B0] font-semibold"
          >
            관리하기 →
          </button>
        </div>
        <div className="space-y-3">
          {goals.slice(0, 2).map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{goal.title}</div>
                <div className="text-sm text-gray-600">
                  {goal.progress}/{goal.target} 완료
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#0AC5A8]">
                  {Math.round((goal.progress / goal.target) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">상세 분석</h2>
        <div className="space-y-4">
          {performanceData.areas.map((area, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{area.name}</h3>
                <div className="text-2xl font-bold text-[#F093B0]">{area.score}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-[#F093B0] h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${area.score}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-600">
                  {area.trend === 'up' ? '📈' : '📉'} {area.trend === 'up' ? '+' : ''}{area.change}점
                </span>
                <span className="text-gray-500">지난주 대비</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">목표 관리</h2>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {goal.status === 'completed' ? '완료' : '진행중'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">진행률</span>
                <span className="text-sm font-semibold text-[#F093B0]">
                  {goal.progress}/{goal.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#F093B0] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-3 bg-[#F093B0] text-white font-semibold rounded-xl hover:bg-[#E085A0] transition-colors">
          + 새 목표 추가하기
        </button>
      </div>
    </div>
  );

  const renderConsultation = () => (
    <div className="space-y-6">
      {/* AI 코치 소개 */}
      <div className="bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-[#F093B0] rounded-full flex items-center justify-center text-white text-2xl">
            👩‍💼
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold text-gray-800">연애 전문 AI 코치</h2>
            <p className="text-sm text-gray-600">개인 맞춤 상담으로 연애 실력을 키워보세요</p>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          연애 전문가가 분석한 데이터를 바탕으로 개인 맞춤 상담을 제공합니다. 
          현재 상황과 목표에 맞는 구체적인 조언을 받아보세요.
        </p>
      </div>

      {/* 상담 주제 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">상담 주제</h2>
        <div className="space-y-3">
          {consultationTopics.map((topic) => (
            <div 
              key={topic.id}
              onClick={() => onNavigate('consultation-detail')}
              className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-4">{topic.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 상담 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">빠른 상담</h2>
        <button className="w-full py-4 bg-[#F093B0] text-white font-semibold rounded-xl hover:bg-[#E085A0] transition-colors flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 mr-2" />
          지금 바로 상담받기
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          현재 상황을 간단히 설명하면 맞춤 조언을 받을 수 있어요
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-gray-800">AI 코칭</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white px-6 py-2 border-b border-gray-200">
        <div className="flex space-x-6">
          {[
            { id: 'overview', label: '개요', icon: ChartBarIcon },
            { id: 'analysis', label: '분석', icon: TargetIcon },
            { id: 'goals', label: '목표', icon: TargetIcon },
            { id: 'consultation', label: '상담', icon: UserIcon }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeSection === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-[#F093B0] bg-[#FDF2F8]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'analysis' && renderAnalysis()}
          {activeSection === 'goals' && renderGoals()}
          {activeSection === 'consultation' && renderConsultation()}
        </div>
      </main>
    </div>
  );
};

export default AICoachingScreen; 