
import React from 'react';
import { UserProfile } from '../types';
import { PREDEFINED_PERSONAS } from '../constants';

interface PersonaRecommendationIntroProps {
  userProfile: UserProfile | null;
  onNext: () => void;
}

const PersonaRecommendationIntro: React.FC<PersonaRecommendationIntroProps> = ({ userProfile, onNext }) => {
  const partnerGender = userProfile?.userGender === 'female' ? 'male' : 'female';
  const recommendedPersonas = PREDEFINED_PERSONAS.filter(p => p.gender === partnerGender);

  const getConsiderations = () => {
    if (!userProfile) return [];
    const considerations = [];
    
    if (userProfile.experience === '없음' || userProfile.experience === '1-2회') {
      considerations.push('연애 초보자를 위한 친근한 성격');
    }
    if (userProfile.difficulty === '대화 시작') {
      considerations.push('대화 시작이 어려우신 분을 위한 적극적인 AI');
    }
    if (userProfile.interests.length > 0) {
      considerations.push(`${userProfile.interests[0].replace(/🎮|🎬|💪|✈️|🍕|📚|🎵|🎨|📱|🐕|☕|📷|🏖️|🎪|💼\s/g, '')} 등 공통 관심사 보유`);
    }
    considerations.push(`${userProfile.userGender === 'male' ? '남성' : '여성'} 사용자를 위한 ${partnerGender === 'male' ? '남성' : '여성'} AI 페르소나`);
    return considerations;
  }
  
  const considerations = getConsiderations();

  return (
    <div className="flex flex-col h-full w-full bg-white animate-fade-in p-6">
      <main className="flex-1 flex flex-col justify-center">
        <h1 className="text-[32px] font-bold leading-tight text-[#191F28] animate-fade-in-up">
          당신에게 딱 맞는<br />
          AI 친구들을 찾았어요!
        </h1>
        <p className="text-base text-[#8B95A1] mt-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          설문 결과를 바탕으로 {recommendedPersonas.length}명을 엄선했어요
        </p>

        <div className="mt-8 p-6 bg-[#F9FAFB] border border-[#E5E8EB] rounded-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-[#191F28]">이런 점을 고려했어요</h2>
          <ul className="mt-4 space-y-3">
            {considerations.map((item, i) => (
              <li key={i} className="flex items-center text-base text-[#4F7ABA] font-medium animate-fade-in-up" style={{ animationDelay: `${300 + i * 100}ms` }}>
                <span className="text-lg mr-3 text-[#0AC5A8]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-xl font-bold text-[#191F28]">이런 AI들이 기다리고 있어요</p>
            <div className="mt-4 flex items-center space-x-3">
                {recommendedPersonas.slice(0, 4).map((p, i) => (
                    <img key={p.id} src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full object-cover shadow-md animate-scale-in" style={{ animationDelay: `${600 + i * 100}ms` }} />
                ))}
                 <div className="w-16 h-16 rounded-full bg-[#F093B0] flex items-center justify-center text-white font-bold text-lg shadow-md animate-scale-in" style={{ animationDelay: '1000ms' }}>
                    +1
                </div>
            </div>
        </div>

      </main>
      
      <footer className="flex-shrink-0 pb-2">
        <p className="text-center text-sm text-[#8B95A1] mb-3">무료로 무제한 대화 가능해요</p>
        <button
          onClick={onNext}
          className="w-full h-14 bg-[#F093B0] text-white text-lg font-bold rounded-xl"
        >
          AI 친구들 만나보기
        </button>
      </footer>
    </div>
  );
};

export default PersonaRecommendationIntro;
