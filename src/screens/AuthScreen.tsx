import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import NicknameInput from '../components/NicknameInput';
import { userDataService } from '../services/userDataService';

type AuthMode = 'login' | 'signup' | 'nickname';

interface AuthScreenProps {
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [tempUserData, setTempUserData] = useState<any>(null);

  const handleSwitchToSignUp = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleSignUpSuccess = (userData: any) => {
    setTempUserData(userData);
    
    // Google OAuth로 가입한 경우 (이름이 이미 있음)
    if (userData.user_metadata?.full_name || userData.user_metadata?.name) {
      console.log('Google OAuth signup - name already available');
      // 바로 메인 앱으로 이동 (닉네임 입력 단계 생략)
      return;
    }
    
    // 이메일로 가입한 경우 (닉네임 입력 필요)
    console.log('Email signup - nickname input required');
    setAuthMode('nickname');
  };

  const handleNicknameComplete = async (nickname: string) => {
    try {
      if (tempUserData?.id) {
        await userDataService.setUserNickname(tempUserData.id, nickname);
        console.log('Nickname set successfully:', nickname);
      }
      // 메인 앱으로 이동하는 로직은 App.tsx에서 처리됩니다
    } catch (error) {
      console.error('Failed to set nickname:', error);
    }
  };

  const handleBackFromNickname = () => {
    setAuthMode('signup');
    setTempUserData(null);
  };

  return (
    <div className="h-full">
      {authMode === 'login' ? (
        <LoginScreen
          onBack={onBack}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      ) : authMode === 'signup' ? (
        <SignUpScreen
          onBack={onBack}
          onSwitchToLogin={handleSwitchToLogin}
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : (
        <NicknameInput
          onComplete={handleNicknameComplete}
          onBack={handleBackFromNickname}
          initialNickname={tempUserData?.user_metadata?.full_name || ''}
        />
      )}
    </div>
  );
};

export default AuthScreen; 