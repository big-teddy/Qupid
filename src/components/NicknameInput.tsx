import React, { useState } from 'react';
import { ArrowLeftIcon } from './Icons';

interface NicknameInputProps {
  onComplete: (nickname: string) => void;
  onBack: () => void;
  initialNickname?: string;
}

const NicknameInput: React.FC<NicknameInputProps> = ({ 
  onComplete, 
  onBack, 
  initialNickname = '' 
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    if (nickname.trim().length < 2) {
      setError('닉네임은 2글자 이상 입력해주세요.');
      return;
    }
    
    if (nickname.trim().length > 10) {
      setError('닉네임은 10글자 이하로 입력해주세요.');
      return;
    }
    
    setError('');
    onComplete(nickname.trim());
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="ml-2 text-lg font-bold text-gray-800">닉네임 설정</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              닉네임을 설정해주세요
            </h2>
            <p className="text-gray-600">
              다른 사용자들에게 보여질 이름입니다
            </p>
          </div>

          {/* Nickname Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nickname Input */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="닉네임을 입력하세요"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {nickname.length}/10 글자
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              다음
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">💡 팁</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 2-10글자 사이로 입력해주세요</li>
              <li>• 특수문자 사용 가능합니다</li>
              <li>• 나중에 설정에서 변경할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NicknameInput; 