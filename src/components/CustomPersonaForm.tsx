import * as React from 'react';
import { useState } from 'react';
import { ArrowLeftIcon, SparklesIcon, CheckIcon } from '../components/Icons';

interface CustomPersonaFormProps {
  onCreate: (personaData: any) => void;
  onBack: () => void;
}

const MBTI_LIST = [
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
  'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
  'INFJ', 'INFP', 'INTJ', 'INTP',
  'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
];

const GENDER_LIST = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
];

// Toss 스타일의 단계별 진행 컴포넌트
const ProgressSteps: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex space-x-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < currentStep ? 'bg-[#F093B0]' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="ml-3 text-sm font-medium text-gray-600">
      {currentStep}/{totalSteps}
    </span>
  </div>
);

// Toss 스타일의 입력 필드 컴포넌트
const TossInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'number';
  isValid?: boolean;
  errorMessage?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', isValid, errorMessage, required }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border-2 rounded-xl text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F093B0] focus:ring-opacity-50 ${
        isValid ? 'border-green-300 bg-green-50' : errorMessage ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      }`}
      placeholder={placeholder}
    />
    {isValid && (
      <div className="flex items-center mt-2 text-green-600">
        <CheckIcon className="w-4 h-4 mr-1" />
        <span className="text-sm">완료</span>
      </div>
    )}
    {errorMessage && (
      <div className="flex items-center mt-2 text-red-600">
        <span className="text-sm">{errorMessage}</span>
      </div>
    )}
  </div>
);

// Toss 스타일의 선택 필드 컴포넌트
const TossSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isValid?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, options, isValid, required }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border-2 rounded-xl text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F093B0] focus:ring-opacity-50 ${
        isValid ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {isValid && (
      <div className="flex items-center mt-2 text-green-600">
        <CheckIcon className="w-4 h-4 mr-1" />
        <span className="text-sm">완료</span>
      </div>
    )}
  </div>
);

// Toss 스타일의 텍스트 영역 컴포넌트
const TossTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isValid?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, isValid, required }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border-2 rounded-xl text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F093B0] focus:ring-opacity-50 resize-none ${
        isValid ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
      }`}
      rows={3}
      placeholder={placeholder}
    />
    {isValid && (
      <div className="flex items-center mt-2 text-green-600">
        <CheckIcon className="w-4 h-4 mr-1" />
        <span className="text-sm">완료</span>
      </div>
    )}
  </div>
);

const CustomPersonaForm: React.FC<CustomPersonaFormProps> = ({ onCreate, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [job, setJob] = useState<string>('');
  const [mbti, setMbti] = useState<string>('ENFP');
  const [intro, setIntro] = useState<string>('');
  const [personalityTraitsInput, setPersonalityTraitsInput] = useState<string>('');
  const [interests, setInterests] = useState<string>('');

  const totalSteps = 4;
  
  // 각 단계별 유효성 검사
  const step1Valid = name.trim() && gender && Number(age) >= 18;
  const step2Valid = job.trim() && mbti;
  const step3Valid = intro.trim();
  const step4Valid = personalityTraitsInput.trim() && interests.trim();

  const isFormValid = step1Valid && step2Valid && step3Valid && step4Valid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const personalityTraits = personalityTraitsInput.split(',').map((s: string) => s.trim()).filter(Boolean);
    const interestsList = interests.split(',').map((s: string) => s.trim()).filter(Boolean);
    
    onCreate({
      name,
      gender,
      age: Number(age),
      job,
      mbti,
      intro,
      personalityTraits,
      interests: interestsList,
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">기본 정보를 입력해주세요</h2>
                         <TossInput
               label="이름"
               value={name}
               onChange={setName}
               placeholder="예: 소연, 민수"
               isValid={!!name.trim()}
               required
             />
            <div className="grid grid-cols-2 gap-4">
                           <TossSelect
               label="성별"
               value={gender}
               onChange={setGender}
               options={GENDER_LIST}
               isValid={!!gender}
               required
             />
              <TossInput
                label="나이"
                value={age}
                onChange={setAge}
                placeholder="예: 28"
                type="number"
                isValid={!!(age && Number(age) >= 18)}
                errorMessage={age && Number(age) < 18 ? '18세 이상이어야 합니다' : undefined}
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">직업과 성격 유형을 선택해주세요</h2>
            <TossInput
              label="직업"
              value={job}
              onChange={setJob}
              placeholder="예: 디자이너, 개발자"
                             isValid={!!job.trim()}
              required
            />
                         <TossSelect
               label="MBTI"
               value={mbti}
               onChange={setMbti}
               options={MBTI_LIST.map(m => ({ value: m, label: m }))}
               isValid={!!mbti}
               required
             />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">자기소개를 작성해주세요</h2>
            <TossTextarea
              label="자기소개"
              value={intro}
              onChange={setIntro}
              placeholder="간단한 자기소개를 입력해 주세요. 예: 안녕하세요! 저는 활발하고 친근한 성격입니다."
                             isValid={!!intro.trim()}
              required
            />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">성격과 관심사를 입력해주세요</h2>
            <TossInput
              label="성격 (콤마로 구분)"
              value={personalityTraitsInput}
              onChange={setPersonalityTraitsInput}
              placeholder="예: 다정함, 유머러스함, 솔직함"
                             isValid={!!personalityTraitsInput.trim()}
              required
            />
            <TossInput
              label="관심사 (콤마로 구분)"
              value={interests}
              onChange={setInterests}
              placeholder="예: 여행, 음악, 독서, 영화"
                             isValid={!!interests.trim()}
              required
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="ml-3 text-lg font-bold text-gray-800">맞춤 페르소나 만들기</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="flex-shrink-0 bg-white px-4 py-4">
        <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {renderStep()}
        </form>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex space-x-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!getStepValidation()}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                getStepValidation()
                  ? 'bg-[#F093B0] text-white hover:bg-[#E085A0] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center ${
                isFormValid
                  ? 'bg-[#F093B0] text-white hover:bg-[#E085A0] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isFormValid ? '페르소나 생성하기' : '모든 정보를 입력해주세요'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );

  function getStepValidation() {
    switch (currentStep) {
      case 1: return step1Valid;
      case 2: return step2Valid;
      case 3: return step3Valid;
      case 4: return step4Valid;
      default: return false;
    }
  }
};

export default CustomPersonaForm;