import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { addPersona, getPersonas } from '../services/personaService';
import { addToFavorites, getUserFavorites } from '../services/favoritesService';
import { DatabaseService } from '../services';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [userId] = useState('test-user-' + Date.now());

  const runTest = async (testName: string, testFn: () => Promise<any>): Promise<TestResult> => {
    try {
      const result = await testFn();
      return {
        test: testName,
        success: true,
        message: '성공',
        data: result
      };
    } catch (error: any) {
      return {
        test: testName,
        success: false,
        message: error.message || '알 수 없는 오류',
        data: error
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests: Array<{ name: string; fn: () => Promise<any> }> = [
      {
        name: 'Supabase 연결 테스트',
        fn: async () => {
          const { data, error } = await supabase.from('users').select('*').limit(1);
          if (error) throw error;
          return { connected: true, data };
        }
      },
      {
        name: '사용자 설정 초기화',
        fn: async () => {
          return await DatabaseService.initializeUser(userId);
        }
      },
      {
        name: '페르소나 생성 테스트',
        fn: async () => {
          const testPersona = {
            user_id: userId,
            name: '테스트 페르소나',
            age: 25,
            gender: 'female' as const,
            job: '테스터',
            mbti: 'ENFP',
            intro: '테스트용 페르소나입니다.',
            avatar: 'https://via.placeholder.com/150',
            matchRate: 85,
            personalityTraits: ['친근함', '호기심'],
            interests: [
              { emoji: '🎮', topic: '게임', description: '게임을 좋아해요' }
            ],
            tags: ['테스트'],
            conversationPreview: [{ text: '안녕하세요!' }],
            custom: true,
            description: '테스트용 맞춤 페르소나'
          };
          return await addPersona(testPersona);
        }
      },
      {
        name: '페르소나 조회 테스트',
        fn: async () => {
          return await getPersonas(userId);
        }
      },
      {
        name: '즐겨찾기 추가 테스트',
        fn: async () => {
          const personas = await getPersonas(userId);
          if (personas.length === 0) throw new Error('테스트할 페르소나가 없습니다');
          return await addToFavorites(userId, personas[0].id);
        }
      },
      {
        name: '즐겨찾기 조회 테스트',
        fn: async () => {
          return await getUserFavorites(userId);
        }
      },
      {
        name: '대시보드 데이터 조회 테스트',
        fn: async () => {
          return await DatabaseService.getDashboardData(userId);
        }
      }
    ];

    const results: TestResult[] = [];
    for (const test of tests) {
      const result = await runTest(test.name, test.fn);
      results.push(result);
      setTestResults([...results]);
      
      // 테스트 간 간격
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">데이터베이스 연결 테스트</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            이 컴포넌트는 Supabase DB 연결과 주요 기능들을 테스트합니다.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isRunning ? '테스트 중...' : '전체 테스트 실행'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              결과 초기화
            </button>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">테스트 결과</h3>
            
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{result.test}</h4>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      result.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.success ? '성공' : '실패'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                
                {result.data && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      데이터 보기
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">테스트 요약</h4>
              <p className="text-sm text-blue-700">
                성공: {testResults.filter(r => r.success).length} / {testResults.length}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ 주의사항</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 환경 변수가 올바르게 설정되어 있는지 확인하세요</li>
            <li>• Supabase 프로젝트에서 DB 스키마가 적용되어 있는지 확인하세요</li>
            <li>• 테스트용 데이터가 생성되므로 실제 환경에서는 주의하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 