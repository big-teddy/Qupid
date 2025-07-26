
import * as React from 'react';
import { useState } from 'react';
import { Persona, UserProfile } from '../types/index';
import { SearchIcon, SettingsIcon, HeartIcon, ArrowLeftIcon } from '../components/Icons';

interface PersonaSelectionProps {
  personas: Persona[];
  userProfile: UserProfile | null;
  onSelect: (persona: Persona) => void;
  onBack: () => void;
  onCreateCustomPersona: () => void;
  onSelectCustomPersona: (persona: Persona) => void;
}

const PersonaCard: React.FC<{ 
  persona: Persona; 
  onSelect: () => void; 
  onSelectCustom: () => void;
}> = ({ persona, onSelect, onSelectCustom }) => {
  return (
    <div 
        className="w-full p-5 flex flex-col bg-white rounded-2xl border border-[#F2F4F6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-1 cursor-pointer"
        onClick={onSelect}
    >
      <div className="flex items-start flex-grow">
          <img src={persona.avatar} alt={persona.name} className="w-20 h-20 rounded-xl object-cover" />
          <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-[#191F28]">{persona.name}, {persona.age}</p>
                  <div className="flex items-center space-x-2">
                      <p className="font-bold text-sm text-[#0AC5A8]">{persona.matchRate}% 맞음</p>
                  </div>
              </div>
              <p className="text-sm text-[#8B95A1] mt-0.5">{persona.job} · {persona.mbti}</p>
              <p className="text-base text-[#191F28] mt-2 font-medium">"{persona.intro}"</p>
          </div>
      </div>
      <button className="w-full h-10 bg-[#FDF2F8] text-[#F093B0] font-bold rounded-lg transition-colors hover:bg-opacity-80 mt-4"
        onClick={e => { 
          e.stopPropagation(); 
          if (persona.custom) {
            onSelectCustom();
          } else {
            onSelect();
          }
        }}>
        대화하기
      </button>
      {persona.custom && <span className="mt-2 text-xs text-[#F093B0] font-bold">나만의 맞춤 페르소나</span>}
    </div>
  );
};

const PersonaSelection: React.FC<PersonaSelectionProps> = ({ personas, userProfile, onSelect, onBack, onCreateCustomPersona, onSelectCustomPersona }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const partnerGender = userProfile?.userGender === 'female' ? 'male' : 'female';
  const filteredPersonas = personas
    .filter((p: Persona) => p.gender === partnerGender)
    .filter((p: Persona) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="flex flex-col h-full w-full bg-[#F9FAFB]">
      <header className="flex-shrink-0 p-3 pt-4 bg-white border-b border-[#F2F4F6]">
        <div className="flex justify-between items-center px-2">
           <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
             <ArrowLeftIcon className="w-6 h-6 text-[#191F28]" />
           </button>
          <h1 className="text-xl font-bold text-[#191F28]">
            추천 AI 친구들
          </h1>
          <button className="flex items-center space-x-1 text-[#4F7ABA] font-medium p-2">
            <SettingsIcon className="w-5 h-5" />
            <span className="hidden sm:inline">필터</span>
          </button>
        </div>
        <div className="mt-3 relative px-2">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
          <input
            type="text"
            placeholder="이름이나 특성으로 검색"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-[#F2F4F6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#F093B0]"
          />
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-5">
        {/* 맞춤/추천 구분 안내 */}
        {/* 맞춤형 AI 만들기 버튼 */}
        <div className="mb-4">
          <button
            onClick={onCreateCustomPersona}
            className="w-full bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] border-2 border-[#F093B0] rounded-xl p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#F093B0] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✨</span>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-bold text-gray-800">맞춤형 AI 만들기</h3>
                <p className="text-sm text-gray-600">원하는 특성으로 나만의 AI를 만들어보세요</p>
              </div>
              <span className="text-[#F093B0] text-sm font-medium">만들기 →</span>
            </div>
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#FDF2F8] text-[#F093B0]">맞춤</span>
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#EBF2FF] text-[#4F7ABA]">추천</span>
          <span className="text-xs text-[#8B95A1]">맞춤: 내가 만든 페르소나, 추천: AI 추천 페르소나</span>
        </div>
        <div className="space-y-4">
          {filteredPersonas.map((persona: Persona, i: number) => (
            <div key={persona.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <PersonaCard 
                persona={persona} 
                onSelect={() => onSelect(persona)} 
                onSelectCustom={() => onSelectCustomPersona(persona)}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-5 bg-[#F7F4FF] rounded-xl text-center">
            <p className="font-bold text-base text-[#191F28]">💡 더 많은 AI 친구들</p>
            <p className="text-sm text-[#6C7680] mt-1">매일 새로운 페르소나가 추가돼요. 내일 또 다른 친구를 만나보세요!</p>
            <button className="mt-3 px-4 py-2 bg-[#F093B0] text-white rounded-lg font-bold" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>맨 위로 이동</button>
        </div>
      </main>
    </div>
  );
};

export default PersonaSelection;
