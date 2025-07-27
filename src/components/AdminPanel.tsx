import React, { useState } from 'react';
import { ADMIN_ACCOUNT, TEST_ACCOUNT } from '../constants/index';
import { userDataService } from '../services/userDataService';
import { supabase } from '../services/supabaseClient';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // 어드민 계정으로 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_ACCOUNT.email,
        password: ADMIN_ACCOUNT.password,
      });

      if (error) {
        // 어드민 계정이 없으면 생성
        console.log('Admin account not found, creating...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_ACCOUNT.email,
          password: ADMIN_ACCOUNT.password,
          options: {
            data: {
              name: ADMIN_ACCOUNT.name,
              user_gender: ADMIN_ACCOUNT.user_gender,
              isAdmin: true
            }
          }
        });

        if (signUpError) {
          setMessage(`어드민 계정 생성 실패: ${signUpError.message}`);
          return;
        }

        // 어드민 프로필 생성
        if (signUpData.user) {
          await userDataService.createOrGetUserProfile(signUpData.user.id, {
            ...ADMIN_ACCOUNT,
            id: signUpData.user.id
          });
          setMessage('어드민 계정이 생성되었습니다!');
        }
      } else {
        setMessage('어드민 계정으로 로그인되었습니다!');
      }
    } catch (error) {
      setMessage(`오류: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // 테스트 계정으로 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_ACCOUNT.email,
        password: TEST_ACCOUNT.password,
      });

      if (error) {
        // 테스트 계정이 없으면 생성
        console.log('Test account not found, creating...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: TEST_ACCOUNT.email,
          password: TEST_ACCOUNT.password,
          options: {
            data: {
              name: TEST_ACCOUNT.name,
              user_gender: TEST_ACCOUNT.user_gender,
              isAdmin: false
            }
          }
        });

        if (signUpError) {
          setMessage(`테스트 계정 생성 실패: ${signUpError.message}`);
          return;
        }

        // 테스트 프로필 생성
        if (signUpData.user) {
          await userDataService.createOrGetUserProfile(signUpData.user.id, {
            ...TEST_ACCOUNT,
            id: signUpData.user.id
          });
          setMessage('테스트 계정이 생성되었습니다!');
        }
      } else {
        setMessage('테스트 계정으로 로그인되었습니다!');
      }
    } catch (error) {
      setMessage(`오류: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('정말로 모든 사용자 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      // 모든 사용자 데이터 삭제
      const { error } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // 시스템 계정 제외

      if (error) {
        setMessage(`데이터베이스 초기화 실패: ${error.message}`);
      } else {
        setMessage('데이터베이스가 초기화되었습니다!');
      }
    } catch (error) {
      setMessage(`오류: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔧 어드민 패널</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* 어드민 계정 로그인 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">👑 어드민 계정</h3>
            <p className="text-sm text-purple-600 mb-3">
              이메일: {ADMIN_ACCOUNT.email}<br/>
              비밀번호: {ADMIN_ACCOUNT.password}
            </p>
            <button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '어드민 로그인'}
            </button>
          </div>

          {/* 테스트 계정 로그인 */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">🧪 테스트 계정</h3>
            <p className="text-sm text-blue-600 mb-3">
              이메일: {TEST_ACCOUNT.email}<br/>
              비밀번호: {TEST_ACCOUNT.password}
            </p>
            <button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '테스트 로그인'}
            </button>
          </div>

          {/* 데이터베이스 초기화 */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ 데이터베이스 초기화</h3>
            <p className="text-sm text-red-600 mb-3">
              모든 사용자 데이터를 삭제합니다. 주의하세요!
            </p>
            <button
              onClick={handleResetDatabase}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '데이터베이스 초기화'}
            </button>
          </div>

          {/* 메시지 표시 */}
          {message && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 