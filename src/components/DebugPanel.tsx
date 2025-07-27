import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userDataService } from '../services/userDataService';
import AdminPanel from './AdminPanel';

const DebugPanel: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const showDebugInfo = async () => {
    if (!user) return;

    try {
      const profile = await userDataService.getUserProfile(user.id);
      setDebugInfo({
        user,
        profile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug info error:', error);
    }
  };

  const forceUpdateName = async () => {
    if (!user) return;

    try {
      // Google OAuth에서 이름 추출
      const googleName = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.email?.split('@')[0] || 
                        '사용자';
      
      await userDataService.forceUpdateUserName(user.id, googleName);
      alert(`이름을 "${googleName}"으로 강제 업데이트했습니다.`);
      showDebugInfo();
    } catch (error) {
      console.error('Force update error:', error);
      alert('업데이트 실패');
    }
  };

  const deleteUserData = async () => {
    if (!user) return;

    if (confirm('정말로 모든 사용자 데이터를 삭제하시겠습니까?')) {
      try {
        await userDataService.deleteUserData(user.id);
        alert('사용자 데이터가 삭제되었습니다. 다시 로그인해주세요.');
        window.location.reload();
      } catch (error) {
        console.error('Delete error:', error);
        alert('삭제 실패');
      }
    }
  };

  const updateExistingNames = async () => {
    if (confirm('기존 사용자들의 하드코딩된 이름을 업데이트하시겠습니까?')) {
      try {
        await userDataService.updateExistingUserNames();
        alert('기존 사용자 이름 업데이트가 완료되었습니다.');
        showDebugInfo();
      } catch (error) {
        console.error('Update names error:', error);
        alert('업데이트 실패');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 text-white p-2 rounded-full shadow-lg"
        title="디버그 패널"
      >
        🐛
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-lg mb-2">디버그 패널</h3>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={showDebugInfo}
              className="w-full bg-blue-500 text-white p-2 rounded text-sm"
            >
              사용자 정보 확인
            </button>
            
            <button
              onClick={forceUpdateName}
              className="w-full bg-green-500 text-white p-2 rounded text-sm"
            >
              이름 강제 업데이트
            </button>
            
            <button
              onClick={deleteUserData}
              className="w-full bg-red-500 text-white p-2 rounded text-sm"
            >
              사용자 데이터 삭제
            </button>
            
            <button
              onClick={updateExistingNames}
              className="w-full bg-orange-500 text-white p-2 rounded text-sm"
            >
              기존 이름 업데이트
            </button>

            <button
              onClick={() => setShowAdminPanel(true)}
              className="w-full bg-purple-500 text-white p-2 rounded text-sm"
            >
              🔧 어드민 패널
            </button>
          </div>

          {debugInfo && (
            <div className="text-xs">
              <h4 className="font-bold mb-1">사용자 정보:</h4>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 어드민 패널 */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default DebugPanel; 