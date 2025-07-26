import * as React from 'react';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  LightbulbIcon,
  UserIcon
} from '../components/Icons';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'home',
      label: '홈',
      icon: HomeIcon,
      description: '오늘의 핵심 현황'
    },
    {
      id: 'chat',
      label: '대화',
      icon: ChatBubbleLeftRightIcon,
      description: 'AI와 대화하기'
    },
    {
      id: 'coaching',
      label: 'AI 코칭',
      icon: LightbulbIcon,
      description: '성과 분석 및 상담'
    },
    {
      id: 'profile',
      label: 'MY',
      icon: UserIcon,
      description: '프로필 및 설정'
    }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bottom-tab-bar border-t border-gray-100 shadow-lg safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] rounded-lg transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#F093B0] bg-[#FDF2F8]'
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-50'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <IconComponent
                className={`w-6 h-6 mb-1 transition-all duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'font-semibold' : 'font-normal'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar; 