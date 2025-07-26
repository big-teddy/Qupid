import * as React from 'react';
import { useState } from 'react';
import { ChevronRightIcon, PlusIcon, MessageBubbleLeftIcon, SparklesIcon } from '../components/Icons';
import { UserProfile, Persona } from '../types';

interface ChatTabScreenProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: string) => void;
  onSelectPersona: (persona: Persona) => void;
  onCreateCustomPersona: () => void;
  personas: Persona[];
}

// 대화 내역 타입 정의
interface ChatHistory {
  id: string;
  persona: Persona;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatTabScreen: React.FC<ChatTabScreenProps> = ({ 
  userProfile, 
  onNavigate, 
  onSelectPersona, 
  onCreateCustomPersona,
  personas
}) => {
  // 임시 대화 내역 데이터 (실제로는 DB에서 가져올 예정)
  const [chatHistories] = useState<ChatHistory[]>([
    {
      id: '1',
      persona: personas[0] || {
        id: '1',
        name: '지민',
        age: 25,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        intro: '활발하고 긍정적인 성격의 지민입니다.',
        tags: ['활발함', '긍정적', '여행'],
        matchRate: 85,
        custom: false
      },
      lastMessage: '오늘 날씨가 정말 좋네요!',
      lastMessageTime: '오후 2:30',
      unreadCount: 2
    },
    {
      id: '2',
      persona: personas[1] || {
        id: '2',
        name: '수진',
        age: 27,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        intro: '차분하고 지적인 수진입니다.',
        tags: ['지적', '차분함', '독서'],
        matchRate: 78,
        custom: false
      },
      lastMessage: '그 책 정말 재미있었어요!',
      lastMessageTime: '오전 11:15',
      unreadCount: 0
    }
  ]);

  const handleStartNewChat = () => {
    // 새 대화 시작 - 페르소나 선택 화면으로 이동
    onNavigate('persona-selection');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">대화</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* 핵심 기능 섹션 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">새로운 대화 시작</h2>
            
            {/* 맞춤형 AI 만들기 */}
            <div 
              onClick={onCreateCustomPersona}
              className="bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-[#F093B0]"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#F093B0] rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-gray-800">맞춤형 AI 만들기</h3>
                  <p className="text-sm text-gray-600">원하는 특성으로 나만의 AI를 만들어보세요</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* 랜덤 AI 선택 */}
            <div 
              onClick={handleStartNewChat}
              className="bg-gradient-to-r from-[#F0FFF4] to-[#EBF8FF] rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-[#0AC5A8]"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0AC5A8] rounded-full flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-gray-800">랜덤 AI 선택</h3>
                  <p className="text-sm text-gray-600">다양한 AI 중에서 새로운 대화를 시작해보세요</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* 대화 내역 섹션 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">대화 내역</h2>
            
            {chatHistories.length > 0 ? (
              <div className="space-y-2">
                {chatHistories.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => onSelectPersona(chat.persona)}
                    className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={chat.persona.avatar} 
                          alt={chat.persona.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {chat.persona.name}, {chat.persona.age}세
                          </h3>
                          <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-medium text-[#0AC5A8]">{chat.persona.matchRate}%</span>
                          <div className="flex space-x-1">
                            {chat.persona.tags.slice(0, 2).map((tag, index) => (
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 대화 내역이 없을 때 */
              <div className="text-center py-8 bg-white rounded-2xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageBubbleLeftIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-600 font-medium mb-2">아직 대화 내역이 없어요</h3>
                <p className="text-sm text-gray-500">위의 버튼을 눌러 첫 대화를 시작해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatTabScreen; 