
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserProfile, Screen } from '../types/index';
import { ArrowLeftIcon, ChevronRightIcon } from "../components/Icons";

interface SettingsScreenProps {
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
}

const TossToggle: React.FC<{ value: boolean; onToggle: () => void; }> = ({ value, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-[30px] w-[50px] rounded-full transition-colors duration-300 ease-in-out focus:outline-none`}
        style={{ backgroundColor: value ? '#F093B0' : '#E5E8EB' }}
    >
        <span
            className={`inline-block w-[26px] h-[26px] transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm`}
            style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
        />
    </button>
);

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightComponent: React.ReactNode;
  onClick: () => void;
  dangerous?: boolean;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, rightComponent, onClick, dangerous = false, isLast = false }) => (
    <button onClick={onClick} className={`flex items-center w-full h-[56px] px-5 ${isLast ? '' : 'border-b border-[#F2F4F6]'}`}>
        <div className="flex items-center flex-1">
            <span className="text-2xl w-6 text-center">{icon}</span>
            <div className="ml-4 text-left">
                <p className={`text-base font-medium ${dangerous ? 'text-[var(--error-red)]' : 'text-[#191F28]'}`}>{title}</p>
                {subtitle && <p className="text-sm text-[#8B95A1]">{subtitle}</p>}
            </div>
        </div>
        <div className="flex items-center space-x-2 text-[#8B95A1]">
            {rightComponent}
        </div>
    </button>
);

interface SectionContainerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, className }) => (
    <div className={`mt-4 ${className}`}>
        {title && <h3 className="px-5 pb-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {children}
        </div>
    </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userProfile, onNavigate, onBack }) => {
    // 토글 상태를 localStorage에 저장/불러오기
    const [practiceNotification, setPracticeNotification] = useState(() => {
      const v = localStorage.getItem('practiceNotification');
      return v === null ? true : v === 'true';
    });
    const [analysisDisplay, setAnalysisDisplay] = useState(() => {
      const v = localStorage.getItem('analysisDisplay');
      return v === null ? true : v === 'true';
    });
    const [darkMode, setDarkMode] = useState(() => {
      const v = localStorage.getItem('darkMode');
      return v === null ? false : v === 'true';
    });
    const [soundEffects, setSoundEffects] = useState(() => {
      const v = localStorage.getItem('soundEffects');
      return v === null ? true : v === 'true';
    });
    const [hapticFeedback, setHapticFeedback] = useState(() => {
      const v = localStorage.getItem('hapticFeedback');
      return v === null ? true : v === 'true';
    });

    useEffect(() => { localStorage.setItem('practiceNotification', String(practiceNotification)); }, [practiceNotification]);
    useEffect(() => { localStorage.setItem('analysisDisplay', String(analysisDisplay)); }, [analysisDisplay]);
    useEffect(() => { localStorage.setItem('darkMode', String(darkMode)); }, [darkMode]);
    useEffect(() => { localStorage.setItem('soundEffects', String(soundEffects)); }, [soundEffects]);
    useEffect(() => { localStorage.setItem('hapticFeedback', String(hapticFeedback)); }, [hapticFeedback]);

    useEffect(() => {
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }, [darkMode]);

    const initial = userProfile.name.charAt(0).toUpperCase();

    if (!userProfile) {
      return <div>프로필 정보가 없습니다. <button onClick={() => onNavigate(Screen.Home)} className="ml-2 underline text-blue-500">홈으로 이동</button></div>;
    }

    return (
        <div className="flex flex-col h-full w-full" style={{ background: 'var(--background)' }}>
            <header className="flex-shrink-0 flex items-center justify-between p-3" style={{ background: 'var(--surface)' }}>
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                </button>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    설정
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {/* Profile Card */}
                <div 
                    className="h-[120px] rounded-2xl p-5 flex items-center"
                    style={{ background: 'linear-gradient(135deg, var(--primary-pink-light), var(--secondary-blue-light))', color: 'var(--text-primary)' }}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: 'var(--primary-pink-main)', color: 'white' }}>
                        {initial}
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{userProfile.name}</p>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Level 3 · 대화 중급자</p>
                        <div className="mt-1.5 h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
                            <div className="h-1 rounded-full" style={{ background: 'var(--primary-pink-main)', width: '75%' }}></div>
                        </div>
                    </div>
                    <button onClick={() => onNavigate(Screen.ProfileEdit)} className="h-8 px-4 rounded-lg border text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'var(--secondary-blue-main)' }}>
                        편집
                    </button>
                </div>

                {/* Learning Settings */}
                <SectionContainer>
                    <SettingItem icon="📚" title="학습 목표 설정" onClick={() => alert('학습 목표 설정은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">일 3회 대화</span><ChevronRightIcon className="w-4 h-4" /></>} />
                    <SettingItem icon="🎯" title="관심 분야 수정" onClick={() => alert('관심 분야 수정은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">게임, 영화 외 3개</span><ChevronRightIcon className="w-4 h-4" /></>} />
                    <SettingItem icon="⏰" title="연습 시간 알림" onClick={() => setPracticeNotification(v => !v)} rightComponent={<TossToggle value={practiceNotification} onToggle={() => setPracticeNotification(v => !v)} />} />
                    <SettingItem icon="📊" title="실시간 분석 표시" onClick={() => setAnalysisDisplay(v => !v)} rightComponent={<TossToggle value={analysisDisplay} onToggle={() => setAnalysisDisplay(v => !v)} />} isLast />
                </SectionContainer>
                
                {/* Personal Info */}
                <SectionContainer title="개인 정보">
                    <SettingItem icon="👤" title="프로필 수정" onClick={() => onNavigate(Screen.ProfileEdit)} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="🚻" title="성별 변경" onClick={() => alert('성별 변경은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">{userProfile.userGender === 'male' ? '남성' : '여성'}</span><ChevronRightIcon className="w-4 h-4" /></>} />
                    <SettingItem icon="📝" title="초기 설문 다시하기" onClick={() => alert('초기 설문 다시하기는 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="🔐" title="개인정보 처리방침" onClick={() => alert('개인정보 처리방침은 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} isLast />
                </SectionContainer>
                
                {/* App Settings */}
                <SectionContainer title="앱 설정">
                    <SettingItem icon="🔔" title="알림 설정" onClick={() => alert('알림 설정은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">모두 허용</span><ChevronRightIcon className="w-4 h-4" /></>} />
                    <SettingItem icon="🌙" title="다크 모드" onClick={() => setDarkMode(v => !v)} rightComponent={<TossToggle value={darkMode} onToggle={() => setDarkMode(v => !v)} />} />
                    {darkMode && <div className="text-xs text-[#F093B0] mt-2 ml-5">다크모드가 적용되었습니다. (일부 화면은 재접속 시 적용될 수 있습니다)</div>}
                    <SettingItem icon="🔊" title="사운드 효과" onClick={() => setSoundEffects(v => !v)} rightComponent={<TossToggle value={soundEffects} onToggle={() => setSoundEffects(v => !v)} />} />
                    <SettingItem icon="📱" title="햅틱 피드백" onClick={() => setHapticFeedback(v => !v)} rightComponent={<TossToggle value={hapticFeedback} onToggle={() => setHapticFeedback(v => !v)} />} />
                    <SettingItem icon="🌐" title="언어 설정" onClick={() => alert('언어 설정은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">한국어</span><ChevronRightIcon className="w-4 h-4" /></>} isLast />
                </SectionContainer>
                
                {/* Data Management */}
                <SectionContainer title="데이터 관리">
                    <SettingItem icon="📈" title="내 데이터 보기" subtitle="대화 기록, 분석 결과 등" onClick={() => alert('내 데이터 보기 기능은 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="📤" title="데이터 내보내기" subtitle="Excel, PDF로 다운로드" onClick={() => onNavigate(Screen.DataExport)} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="🗑️" title="대화 기록 삭제" subtitle="선택적 또는 전체 삭제" onClick={() => alert('대화 기록 삭제는 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="☁️" title="백업 설정" onClick={() => alert('백업 설정은 추후 지원 예정입니다.')} rightComponent={<><span className="text-base font-medium">자동 백업 ON</span><ChevronRightIcon className="w-4 h-4" /></>} isLast />
                </SectionContainer>
                
                {/* Customer Support */}
                <SectionContainer title="고객 지원">
                    <SettingItem icon="❓" title="도움말" onClick={() => alert('도움말은 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="📞" title="고객센터 문의" onClick={() => alert('고객센터 문의는 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="⭐" title="앱 평가하기" onClick={() => alert('앱 평가는 추후 지원 예정입니다.')} rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                    <SettingItem icon="📄" title="버전 정보" onClick={() => alert('버전 정보는 추후 지원 예정입니다.')} rightComponent={<span className="text-base font-medium">v1.2.3</span>} isLast />
                </SectionContainer>
                
                {/* Danger Zone */}
                <div className="mt-8">
                     <SectionContainer>
                        <SettingItem icon="🚪" title="로그아웃" onClick={() => { if(window.confirm('정말 로그아웃 하시겠습니까?')) alert('로그아웃 기능은 추후 지원 예정입니다.'); }} dangerous rightComponent={<ChevronRightIcon className="w-4 h-4" />} />
                        <SettingItem icon="❌" title="회원 탈퇴" subtitle="모든 데이터가 삭제됩니다" onClick={() => { if(window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) onNavigate(Screen.DeleteAccount); }} dangerous rightComponent={<ChevronRightIcon className="w-4 h-4" />} isLast />
                    </SectionContainer>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;
