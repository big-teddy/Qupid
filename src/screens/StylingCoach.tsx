import * as React from 'react';
import { useState, useCallback } from 'react';
import { getStylingAdvice } from '../services/geminiService';
import { ArrowLeftIcon, SparklesIcon } from '../components/Icons';

interface StylingCoachProps {
  onBack: () => void;
}

const MIN_PROMPT_LENGTH = 5;

const StylingCoach: React.FC<StylingCoachProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ text: string; imageUrl: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPromptValid = prompt.trim().length >= MIN_PROMPT_LENGTH && /[a-zA-Z가-힣0-9]/.test(prompt);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPromptValid || isLoading) {
      setError('스타일 요청을 5자 이상, 구체적으로 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await getStylingAdvice(prompt);
      if (!response.text) {
        setError('스타일 추천을 생성하지 못했습니다. 다시 시도해 주세요.');
        return;
      }
      setResult(response);
    } catch (err) {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, isPromptValid]);

  return (
    <div className="flex flex-col h-full animate-back-out" style={{ backgroundColor: 'var(--surface)' }}>
       <header className="flex-shrink-0 flex items-center p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
          <ArrowLeftIcon className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>AI 스타일링 코치</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          어떤 상황에 어울리는 스타일이 궁금하신가요? 구체적으로 질문해보세요.<br />
          <span className="text-sm">(예시: "20대 후반 남성, 첫 소개팅을 위한 깔끔한 캐주얼룩 추천"<br/>"여름 휴가에 어울리는 시원한 스타일"<br/>"면접에 적합한 단정한 스타일" 등)</span>
        </p>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setError(null); }}
              placeholder="궁금한 스타일을 구체적으로 입력하세요..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                borderColor: 'var(--border)', 
                backgroundColor: 'var(--background)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--secondary-blue-main)'
              } as React.CSSProperties}
              disabled={isLoading}
              minLength={MIN_PROMPT_LENGTH}
            />
            <button
              type="submit"
              disabled={isLoading || !isPromptValid}
              className="text-white font-semibold py-3 px-6 rounded-lg transition-opacity disabled:opacity-50 flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary-pink-main)'}}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><SparklesIcon className="w-5 h-5 mr-2" /> 스타일 추천받기</>
              )}
            </button>
          </div>
        </form>

        {error && <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--error-red-light)', color: 'var(--error-red)'}}>
          {error}
          <button className="ml-3 px-3 py-1 bg-[#F093B0] text-white rounded" onClick={() => setError(null)}>닫기</button>
          <button className="ml-2 px-3 py-1 border border-[#F093B0] text-[#F093B0] rounded" onClick={() => setPrompt('')}>입력 초기화</button>
        </div>}

        {result && (
          <div className="mt-6 space-y-6 animate-fade-in-down">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--background)'}}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>AI 추천 이미지</h3>
              {result.imageUrl ? (
                <img src={result.imageUrl} alt="AI generated style" className="w-full rounded-lg shadow-md" />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p style={{ color: 'var(--text-tertiary)'}}>
                      이미지를 불러올 수 없습니다.<br/>텍스트 추천을 참고해 주세요.
                    </p>
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--background)'}}>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                스타일링 조언
              </h3>
              <p className="whitespace-pre-wrap" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{result.text}</p>
            </div>
          </div>
        )}
        {!result && !isLoading && !error && (
          <div className="mt-10 text-center text-[#8B95A1] text-base">
            스타일링 코치에게 궁금한 점을 입력해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default StylingCoach;