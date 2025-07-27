import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeftIcon, CheckIcon } from "../components/Icons";
import { UserProfile } from '../types/index';
import Button from '../components/Button';
import { OnboardingFlowProps } from '../types/props';
import { initialProfile } from '../constants/index';

const TOTAL_ONBOARDING_STEPS = 7;

// --- Reusable Components ---
const ProgressDots: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <div className="flex items-center justify-center space-x-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 ${i === current -1 ? 'w-2.5 h-2.5' : 'w-2 h-2'}`}
        style={{ backgroundColor: i === current -1 ? 'var(--primary-pink-main)' : 'var(--border)' }}
      />
    ))}
  </div>
);

const OnboardingHeader: React.FC<{ onBack?: () => void; progress?: number; onSkip?: () => void }> = ({ onBack, progress, onSkip }) => (
  <header className="absolute top-0 left-0 right-0 h-14 flex items-center px-4 z-10">
    <div className="w-10">
    {onBack && (
      <button onClick={onBack} className="p-2 -ml-2">
        <ArrowLeftIcon className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
      </button>
    )}
    </div>
    <div className="flex-1 flex justify-center">{progress && <ProgressDots total={TOTAL_ONBOARDING_STEPS} current={progress} />}</div>
    <div className="w-20 text-right">
      {onSkip && (
          <button onClick={onSkip} className="text-base" style={{ color: 'var(--text-secondary)' }}>건너뛰기</button>
      )}
    </div>
  </header>
);

const FixedBottomButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white" style={{boxShadow: '0 -10px 30px -10px rgba(0,0,0,0.05)'}}>
        <Button
            onClick={onClick}
            disabled={disabled}
            fullWidth
            className="h-14 text-lg font-bold rounded-xl"
            style={{ minHeight: 56 }}
        >
            {children}
        </Button>
    </div>
);

const CheckCircle: React.FC<{checked: boolean}> = ({ checked }) => (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${checked ? 'bg-[#F093B0] border-[#F093B0]' : 'border-[#E5E8EB]'}`}>
        {checked && <CheckIcon className="w-4 h-4 text-white" />}
    </div>
)

// --- Onboarding Screens ---
const IntroScreen: React.FC<{ onNext: () => void; onSkip: () => void }> = ({ onNext, onSkip }) => (
  <div className="flex flex-col h-full w-full animate-fade-in">
    <OnboardingHeader progress={1} onSkip={onSkip} />
    <main className="flex-1 flex flex-col justify-center px-6 -mt-14">
      <h1 className="text-3xl font-bold leading-tight animate-scale-in" style={{ color: 'var(--text-primary)'}}>
        <span style={{color: 'var(--primary-pink-main)'}}>3개월 후,</span><br/>
        자신 있게 대화하는<br/>
        당신을 만나보세요
      </h1>
      <div className="mt-10 space-y-4">
        {['AI와 무제한 대화 연습', '실시간 대화 실력 분석', '실제 이성과 안전한 매칭'].map((text, i) => (
             <div key={text} className="flex items-center animate-fade-in-up" style={{animationDelay: `${i*100 + 200}ms`}}>
                <span className="text-lg mr-3" style={{ color: 'var(--success-green)'}}>✓</span>
                <p className="text-lg font-medium" style={{color: 'var(--text-primary)'}}>{text}</p>
            </div>
        ))}
      </div>
       <div className="mt-8 p-4 rounded-xl animate-fade-in-up delay-500" style={{ backgroundColor: 'var(--secondary-blue-light)' }}>
         <p className="text-base text-center" style={{color: 'var(--secondary-blue-dark)'}}>
           이미 <span className="font-bold">1,247명</span>이 대화 실력을 키웠어요
         </p>
       </div>
    </main>
    <FixedBottomButton onClick={onNext}>무료로 시작하기</FixedBottomButton>
  </div>
);

const GenderSelectionScreen: React.FC<{ onNext: (gender: 'male' | 'female') => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [selected, setSelected] = useState<'male' | 'female' | null>(null);

    const GenderCard: React.FC<{
        gender: 'male' | 'female',
        icon: string,
        iconBg: string,
        description: string,
    }> = ({ gender, icon, iconBg, description }) => (
        <button
            onClick={() => setSelected(gender)}
            className={`w-full h-[120px] p-6 flex items-center border-2 rounded-2xl transition-all duration-200 ${selected === gender ? 'border-[#F093B0] bg-[#FDF2F8] scale-[1.01]' : 'border-[#E5E8EB] bg-white'}`}
        >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: iconBg }}>{icon}</div>
            <div className="flex-1 ml-4 text-left">
                <p className="text-2xl font-bold" style={{color: '#191F28'}}>{gender === 'male' ? '남성' : '여성'}</p>
                <p className="text-base" style={{color: '#8B95A1'}}>{description}</p>
            </div>
            <CheckCircle checked={selected === gender} />
        </button>
    );

    return (
        <div className="flex flex-col h-full w-full animate-fade-in">
            <OnboardingHeader onBack={onBack} progress={2} />
            <main className="flex-1 flex flex-col px-6 pt-20">
                <h1 className="text-[28px] font-bold" style={{color: '#191F28'}}>어떤 이성과 대화 연습할까요?</h1>
                <p className="text-base mt-2" style={{color: '#8B95A1'}}>선택하신 성별에 따라 맞춤 AI를 추천해드려요</p>
                <div className="mt-10 space-y-4">
                    <GenderCard gender="male" icon="👨" iconBg="#EBF2FF" description="여성 AI와 대화 연습을 해요" />
                    <GenderCard gender="female" icon="👩" iconBg="#FDF2F8" description="남성 AI와 대화 연습을 해요" />
                </div>
                <div className="mt-8 p-5 rounded-xl bg-[#F9FAFB]">
                    <p className="font-bold text-base flex items-center" style={{color: '#191F28'}}>💡 선택하는 이유</p>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm" style={{color: '#4F7ABA'}}>
                        <li>더 자연스러운 이성 대화 연습을 위해</li>
                        <li>실제 상황과 비슷한 환경 조성</li>
                        <li>나중에 설정에서 변경 가능해요</li>
                    </ul>
                </div>
            </main>
            <FixedBottomButton onClick={() => selected && onNext(selected)} disabled={!selected}>
                {selected ? "다음 단계로" : "성별을 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};

const SurveyScreen: React.FC<{
    progress: number,
    questionNumber: number,
    mainQuestion: React.ReactNode,
    subQuestion: string,
    options: {emoji: string, title: string, subtitle: string, value: string}[],
    onSelect: (value: string) => void,
    onBack: () => void
}> = ({ progress, questionNumber, mainQuestion, subQuestion, options, onSelect, onBack }) => {
    
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (value: string) => {
        setSelected(value);
        setTimeout(() => onSelect(value), 200);
    };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in">
            <OnboardingHeader onBack={onBack} progress={progress} />
            <main className="flex-1 flex flex-col px-6 pt-20">
                <p className="text-lg font-bold" style={{color: '#F093B0'}}>{questionNumber}/4</p>
                <h1 className="text-[32px] font-bold mt-2 leading-tight" style={{color: '#191F28'}}>{mainQuestion}</h1>
                <p className="text-base mt-4" style={{color: '#8B95A1'}}>{subQuestion}</p>
                <div className="mt-12 space-y-3">
                    {options.map(opt => {
                        const isSelected = selected === opt.value;
                        return (
                            <button key={opt.value} onClick={() => handleSelect(opt.value)} 
                                className={`w-full h-20 p-5 flex items-center border-2 rounded-xl transition-all duration-200 ${isSelected ? 'border-[#F093B0] bg-[#FDF2F8] scale-[1.02]' : 'border-[#E5E8EB] bg-white hover:border-gray-300'}`}>
                               <span className="text-3xl">{opt.emoji}</span>
                               <div className="flex-1 ml-4 text-left">
                                   <p className="text-xl font-bold" style={{color: '#191F28'}}>{opt.title}</p>
                                   <p className="text-sm" style={{color: '#8B95A1'}}>{opt.subtitle}</p>
                               </div>
                               <CheckCircle checked={isSelected} />
                            </button>
                        );
                    })}
                </div>
                <p className="mt-auto mb-20 text-center text-sm font-medium" style={{color: '#8B95A1'}}>
                    솔직하게 답변할수록 더 정확한 추천을 받을 수 있어요
                </p>
            </main>
        </div>
    );
};

const InterestsScreen: React.FC<{ onComplete: (interests: string[]) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
    const INTERESTS = [
        "🎮 게임", "🎬 영화/드라마", "💪 운동/헬스", "✈️ 여행", "🍕 맛집/요리", "📚 독서",
        "🎵 음악", "🎨 예술/문화", "📱 IT/테크", "🐕 반려동물", "☕ 카페투어", "📷 사진",
        "🏖️ 아웃도어", "🎪 공연/전시", "💼 자기계발"
    ];
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        setSelected(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            }
            if (prev.length < 5) {
                return [...prev, interest];
            }
            return prev;
        });
    };

    const getHelperText = () => {
        if(selected.length === 0) return <p style={{color: '#FF4757'}}>최소 1개는 선택해주세요</p>;
        if(selected.length >= 5) return <p style={{color: '#FF8A00'}}>최대 5개까지 선택 가능해요</p>;
        return <p style={{color: '#F093B0'}}>{selected.length}개 선택됨</p>;
    }
    
    return (
        <div className="flex flex-col h-full w-full animate-fade-in">
            <OnboardingHeader onBack={onBack} progress={6} />
            <main className="flex-1 flex flex-col px-6 pt-20">
                 <p className="text-lg font-bold" style={{color: '#F093B0'}}>4/4</p>
                <h1 className="text-[32px] font-bold mt-2 leading-tight" style={{color: '#191F28'}}>평소 관심 있는<br/>분야를 선택해주세요</h1>
                <p className="text-base mt-4" style={{color: '#8B95A1'}}>공통 관심사로 대화 주제를 추천해드려요</p>
                <p className="text-base font-bold mt-1" style={{color: '#F093B0'}}>여러 개 선택 가능 (최소 1개, 최대 5개)</p>
                
                <div className="mt-8 flex flex-wrap gap-x-2 gap-y-3">
                    {INTERESTS.map(interest => {
                        const isSelected = selected.includes(interest);
                        return (
                            <button key={interest} onClick={() => toggleInterest(interest)} className={`h-12 px-4 flex items-center justify-center rounded-full transition-all duration-200 border text-base font-medium ${isSelected ? 'bg-[#FDF2F8] border-2 border-[#F093B0] text-[#DB7093]' : 'bg-[#F9FAFB] border-[#E5E8EB] text-[#191F28]'}`}>
                                {isSelected && <span className="mr-1.5">✓</span>}
                                {interest}
                            </button>
                        )
                    })}
                </div>
                <div className="mt-4 text-center font-bold text-base">
                    {getHelperText()}
                </div>
            </main>
            <FixedBottomButton onClick={() => onComplete(selected)} disabled={selected.length === 0}>
                {selected.length > 0 ? "설문 완료하기" : "관심사를 선택해주세요"}
            </FixedBottomButton>
        </div>
    );
};

const CompletionScreen: React.FC<{ profile: UserProfile, onComplete: () => void }> = ({ profile, onComplete }) => {
    return (
        <div className="flex flex-col h-full w-full animate-fade-in">
             <OnboardingHeader progress={7} />
             <main className="flex-1 flex flex-col justify-center items-center px-6 -mt-14">
                <div className="w-32 h-32 rounded-full bg-[#F093B0] flex items-center justify-center animate-scale-in">
                    <CheckIcon className="w-16 h-16 text-white" />
                </div>
                <h1 className="mt-8 text-[28px] font-bold text-center" style={{color: '#191F28'}}>당신의 프로필이<br/>완성됐어요!</h1>

                <div className="mt-6 w-full p-6 bg-[#F9FAFB] rounded-2xl space-y-3 animate-fade-in-up delay-200">
                    {[
                        { label: '성별', value: profile.user_gender === 'male' ? '남성 (여성 AI와 연습)' : '여성 (남성 AI와 연습)'},
                        { label: '경험', value: profile.experience },
                        { label: '목표', value: profile.difficulty ? `${profile.difficulty} 연습` : '대화 연습'},
                        { label: '관심사', value: profile.interests.join(', ').replace(/🎮|🎬|💪|✈️|🍕|📚|🎵|🎨|📱|🐕|☕|📷|🏖️|🎪|💼\s/g, '') },
                    ].map(item => (
                        <div key={item.label} className="flex justify-between items-baseline">
                           <p className="text-base font-bold" style={{color: '#191F28'}}>{item.label}</p>
                           <p className="text-base text-right font-medium" style={{color: '#4F7ABA'}}>{item.value}</p>
                        </div>
                    ))}
                </div>
                
                <p className="mt-auto mb-4 text-base font-medium" style={{color: '#8B95A1'}}>5명의 다양한 AI가 기다리고 있어요</p>
             </main>
             <FixedBottomButton onClick={onComplete}>AI 친구들 만나러 가기</FixedBottomButton>
        </div>
    );
}

// initialProfile은 constants에서 import

const surveyQuestions = [
    { key: 'experience', main: <>이성과의 연애 경험이<br/>어느 정도인가요?</>, sub: "경험에 맞는 적절한 난이도로 시작해드려요", options: [
        {emoji: '😅', title: "전혀 없어요", subtitle: "처음이라 긴장돼요", value: '없음'},
        {emoji: '🤷‍♂️', title: "1-2번 정도", subtitle: "경험은 있지만 어색해요", value: '1-2회'},
        {emoji: '😊', title: "몇 번 있어요", subtitle: "기본은 할 수 있어요", value: 'N회'},
        {emoji: '😎', title: "많은 편이에요", subtitle: "더 나은 소통을 원해요", value: '많음'},
    ]},
    { key: 'confidence', main: <>이성과 대화할 때<br/>어떤 기분인가요?</>, sub: "현재 상태를 파악해서 맞춤 연습을 준비해요", options: [
        {emoji: '😰', title: "매우 긴장돼요", subtitle: "말이 잘 안 나와요", value: '매우 긴장'},
        {emoji: '😅', title: "조금 어색해요", subtitle: "무슨 말을 해야할지...", value: '조금 어색'},
        {emoji: '😐', title: "보통이에요", subtitle: "상황에 따라 달라요", value: '보통'},
        {emoji: '😄', title: "편안해요", subtitle: "자연스럽게 대화 가능", value: '편안함'},
    ]},
    { key: 'difficulty', main: <>대화에서 가장 어려운<br/>부분은 무엇인가요?</>, sub: "약점을 집중적으로 연습할 수 있어요", options: [
        {emoji: '🗣️', title: "대화 시작하기", subtitle: "첫 마디가 가장 어려워요", value: '대화 시작'},
        {emoji: '💬', title: "대화 이어가기", subtitle: "금방 할 말이 없어져요", value: '대화 유지'},
        {emoji: '❤️', title: "감정 표현하기", subtitle: "내 마음을 표현하기 어려워요", value: '감정 표현'},
        {emoji: '🤝', title: "상대방 이해하기", subtitle: "상대의 마음을 잘 모르겠어요", value: '상대 이해'},
    ]},
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = (props) => {
  const [step, setStep] = useState(0);
  const [surveySubStep, setSurveySubStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const nextStepTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
        if(nextStepTimeoutRef.current) {
            clearTimeout(nextStepTimeoutRef.current);
        }
    }
  }, []);

  const nextStep = useCallback(() => setStep(s => s + 1), []);
  const prevStep = useCallback(() => setStep(s => s > 0 ? s - 1 : 0), []);
  
  const handleFinalComplete = useCallback(() => props.onComplete(profile), [props.onComplete, profile]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setProfile(p => ({ ...p, user_gender: gender }));
    nextStep();
  };

  const handleSurveySelect = (value: string) => {
    const currentQuestionKey = surveyQuestions[surveySubStep].key as keyof UserProfile;
    setProfile(p => ({...p, [currentQuestionKey]: value}));
    
    if (nextStepTimeoutRef.current) clearTimeout(nextStepTimeoutRef.current);
    nextStepTimeoutRef.current = window.setTimeout(() => {
        if (surveySubStep < surveyQuestions.length - 1) {
            setSurveySubStep(s => s + 1);
        } else {
            nextStep();
        }
    }, 400);
  };
  
  const handleInterestComplete = (interests: string[]) => {
      setProfile(p => ({...p, interests}));
      nextStep();
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <IntroScreen onNext={nextStep} onSkip={() => props.onComplete(initialProfile)} />;
      case 1: return <GenderSelectionScreen onNext={handleGenderSelect} onBack={prevStep} />;
      case 2:
          const questionProps = {
              progress: 3 + surveySubStep,
              questionNumber: surveySubStep + 1,
              mainQuestion: surveyQuestions[surveySubStep].main,
              subQuestion: surveyQuestions[surveySubStep].sub,
              options: surveyQuestions[surveySubStep].options,
              onSelect: handleSurveySelect,
              onBack: surveySubStep > 0 ? () => setSurveySubStep(s => s - 1) : prevStep,
          };
          return <SurveyScreen {...questionProps} />;
      case 3: return <InterestsScreen onComplete={handleInterestComplete} onBack={() => { setSurveySubStep(surveyQuestions.length - 1); prevStep(); }} />;
      case 4: return <CompletionScreen profile={profile} onComplete={handleFinalComplete} />;
      default: return <IntroScreen onNext={nextStep} onSkip={() => props.onComplete(initialProfile)} />;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative" style={{ backgroundColor: 'var(--surface)' }}>
      {renderStep()}
    </div>
  );
};