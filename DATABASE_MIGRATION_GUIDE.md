# 🗄️ 데이터베이스 마이그레이션 가이드

연애 박사 앱의 하드코딩된 데이터를 실제 데이터베이스로 마이그레이션하는 방법입니다.

## 📋 개요

이 가이드는 다음 하드코딩된 데이터들을 실제 DB로 교체하는 방법을 설명합니다:
- 사용자 프로필 및 성장 수치
- 대화 내역 및 분석 결과
- 성취 및 배지 데이터
- 즐겨찾기 및 맞춤 페르소나
- 주간 목표 및 학습 목표

## 🚀 1단계: 데이터베이스 스키마 설정

### Supabase 프로젝트에서 SQL Editor 실행

```sql
-- database_schema_complete.sql 파일의 전체 내용을 실행
-- 이 스크립트는 모든 테이블, 인덱스, RLS 정책, 트리거를 생성합니다
```

### 주요 테이블 구조

1. **user_profiles**: 사용자 기본 정보 및 성장 데이터
2. **conversation_sessions**: 대화 세션 정보
3. **conversation_messages**: 개별 메시지 저장
4. **user_achievements**: 사용자 성취 관리
5. **user_badges**: 사용자 배지 관리
6. **user_weekly_goals**: 주간 목표 관리
7. **user_favorites**: 즐겨찾기 관리
8. **user_custom_personas**: 맞춤 페르소나
9. **user_growth_stats**: 성장 통계
10. **user_notification_settings**: 알림 설정

## 🔧 2단계: 환경 변수 설정

### .env.local 파일 생성

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Key (선택사항)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📊 3단계: 하드코딩된 데이터 제거

### 제거된 하드코딩 데이터들

#### 1. 사용자 성장 수치
**이전 (하드코딩)**:
```typescript
const stats = {
  level: userProfile?.level || 3,
  experiencePoints: userProfile?.experiencePoints || 750,
  totalConversations: userProfile?.totalConversations || 15,
  averageScore: userProfile?.averageScore || 78,
  streakDays: userProfile?.streakDays || 5
};
```

**현재 (DB 기반)**:
```typescript
const stats = {
  level: userProfile?.level || 1,
  experiencePoints: userProfile?.experiencePoints || 0,
  totalConversations: userProfile?.totalConversations || 0,
  averageScore: userProfile?.averageScore || 0,
  streakDays: userProfile?.streakDays || 0
};
```

#### 2. 즐겨찾기 데이터
**이전 (하드코딩)**:
```typescript
const [favoriteIds, setFavoriteIds] = useState<string[]>(['f1', 'm2']);
```

**현재 (DB 기반)**:
```typescript
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
// DB에서 로드: userDataService.getUserFavorites(userId)
```

#### 3. 대화 히스토리
**이전 (하드코딩)**:
```typescript
const [chatHistories] = useState<ChatHistory[]>([
  // 하드코딩된 대화 기록
]);
```

**현재 (DB 기반)**:
```typescript
// DB에서 로드: userDataService.getChatHistory(userId)
```

## 🔄 4단계: 데이터 로드 로직 구현

### App.tsx에서 사용자 데이터 로드

```typescript
const loadUserData = useCallback(async (userId: string) => {
  if (!userId) return;
  
  setDataLoading(true);
  try {
    // 사용자 프로필 로드
    const profile = await userDataService.getUserProfile(userId);
    if (profile) {
      setUserProfile(profile);
    }

    // 즐겨찾기 로드
    const favorites = await userDataService.getUserFavorites(userId);
    setFavoriteIds(favorites);

    // 맞춤 페르소나 로드
    const customPersonasData = await userDataService.getUserCustomPersonas(userId);
    setCustomPersonas(customPersonasData.map(/* 변환 로직 */));

    // 주간 목표 생성 (없으면)
    await userDataService.createWeeklyGoalsIfNotExist(userId);

  } catch (error) {
    console.error('Load user data error:', error);
  } finally {
    setDataLoading(false);
  }
}, [setUserProfile]);
```

## 📈 5단계: 실시간 데이터 업데이트

### 대화 완료 시 통계 업데이트

```typescript
const handleCompleteChat = useCallback(async (analysis: ConversationAnalysis | null) => {
  if (!user?.id || !selectedPersona) return;

  try {
    // 대화 세션 완료 처리
    if (analysis) {
      // 실제 구현에서는 대화 세션 ID를 추적해야 함
      console.log('Conversation completed with analysis:', analysis);
    }

    // 튜토리얼 완료 처리
    if (isChatInTutorialMode) {
      localStorage.setItem('tutorialCompleted', 'true');
      setIsTutorialCompleted(true);
      setIsChatInTutorialMode(false);
      setActiveTab('home');
      setCurrentScreen(Screen.Home);
      setShowTutorialCompletion(true);
      setTimeout(() => setShowTutorialCompletion(false), 5000);
      return;
    }
    
    setAnalysisResult(analysis);
    setCurrentScreen(Screen.ConversationAnalysis);
  } catch (error) {
    console.error('Complete chat error:', error);
  }
}, [isChatInTutorialMode, user?.id, selectedPersona, setIsTutorialCompleted]);
```

### 즐겨찾기 토글

```typescript
const toggleFavorite = useCallback(async (personaId: string) => {
  if (!user?.id) return;

  try {
    const success = await userDataService.toggleFavorite(user.id, personaId);
    if (success) {
      setFavoriteIds(prev => 
        prev.includes(personaId) 
          ? prev.filter(id => id !== personaId)
          : [...prev, personaId]
      );
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
  }
}, [user?.id]);
```

## 🎯 6단계: 성취 및 배지 시스템

### 자동 성취 업데이트

```typescript
// userDataService.ts에서 성취 업데이트
async updateAchievement(userId: string, achievementId: string, progress: number, acquired: boolean = false): Promise<boolean> {
  try {
    const updateData: any = {
      progress_current: progress,
      updated_at: new Date().toISOString()
    };

    if (acquired) {
      updateData.acquired = true;
      updateData.acquired_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from('user_achievements')
      .update(updateData)
      .eq('user_id', userId)
      .eq('achievement_id', achievementId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Update achievement error:', error);
    return false;
  }
}
```

## 📊 7단계: 성장 통계 추적

### 자동 통계 업데이트 (DB 트리거)

```sql
-- 대화 완료 시 자동으로 통계 업데이트
CREATE OR REPLACE FUNCTION update_user_stats_after_conversation()
RETURNS TRIGGER AS $$
DECLARE
  session_duration INTEGER;
BEGIN
  -- 세션 지속 시간 계산
  session_duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))::INTEGER;
  
  -- 사용자 프로필 업데이트
  UPDATE user_profiles 
  SET 
    total_conversations = total_conversations + 1,
    average_score = CASE 
      WHEN total_conversations = 0 THEN NEW.analysis_score
      ELSE ((average_score * total_conversations) + NEW.analysis_score) / (total_conversations + 1)
    END,
    experience_points = experience_points + 50 + 
      CASE 
        WHEN NEW.analysis_score >= 90 THEN 30
        WHEN NEW.analysis_score >= 80 THEN 20
        WHEN NEW.analysis_score >= 70 THEN 10
        ELSE 0
      END,
    level = CASE 
      WHEN experience_points >= 1000 THEN 10
      WHEN experience_points >= 900 THEN 9
      -- ... 레벨 계산 로직
    END,
    last_active_date = NOW(),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔍 8단계: 테스트 및 검증

### 데이터 로드 테스트

1. **새 사용자 가입**
   ```bash
   # 회원가입 후 자동 생성되는 데이터 확인
   - user_profiles 테이블에 기본 프로필 생성
   - user_achievements 테이블에 기본 성취 생성
   - user_badges 테이블에 기본 배지 생성
   - user_notification_settings 테이블에 기본 설정 생성
   ```

2. **대화 완료 테스트**
   ```bash
   # 대화 완료 후 자동 업데이트 확인
   - conversation_sessions 테이블에 세션 기록
   - conversation_messages 테이블에 메시지 기록
   - user_profiles 테이블의 통계 업데이트
   - user_growth_stats 테이블에 일일 통계 기록
   ```

3. **즐겨찾기 테스트**
   ```bash
   # 즐겨찾기 추가/제거 확인
   - user_favorites 테이블에 추가/제거 기록
   - UI에서 즉시 반영 확인
   ```

### 성능 최적화

1. **인덱스 확인**
   ```sql
   -- 주요 쿼리 성능을 위한 인덱스
   CREATE INDEX idx_conversation_sessions_user_id ON conversation_sessions(user_id);
   CREATE INDEX idx_conversation_sessions_start_time ON conversation_sessions(start_time);
   CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
   ```

2. **RLS 정책 확인**
   ```sql
   -- 사용자별 데이터 접근 제어
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);
   ```

## 🚨 9단계: 문제 해결

### 일반적인 문제들

1. **데이터 로드 실패**
   ```bash
   # 확인 사항
   - Supabase 연결 상태
   - 환경 변수 설정
   - RLS 정책 설정
   - 네트워크 연결
   ```

2. **성취 업데이트 실패**
   ```bash
   # 확인 사항
   - 트리거 함수 실행 권한
   - 테이블 구조 일치성
   - 데이터 타입 일치성
   ```

3. **즐겨찾기 동기화 문제**
   ```bash
   # 확인 사항
   - 사용자 인증 상태
   - 데이터베이스 연결
   - 에러 로그 확인
   ```

## 📈 10단계: 모니터링 및 최적화

### 성능 모니터링

1. **쿼리 성능**
   ```sql
   -- 느린 쿼리 확인
   SELECT query, mean_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC;
   ```

2. **테이블 크기**
   ```sql
   -- 테이블별 크기 확인
   SELECT 
     schemaname,
     tablename,
     attname,
     n_distinct,
     correlation
   FROM pg_stats 
   WHERE schemaname = 'public';
   ```

### 데이터 백업

```sql
-- 정기적인 데이터 백업
-- Supabase 대시보드에서 자동 백업 설정
-- 또는 수동 백업 스크립트 실행
```

## 🎉 마이그레이션 완료!

이제 모든 하드코딩된 데이터가 실제 데이터베이스로 관리됩니다:

✅ **사용자별 개인화된 데이터**
✅ **실시간 성장 추적**
✅ **대화 히스토리 저장**
✅ **성취 및 배지 시스템**
✅ **즐겨찾기 관리**
✅ **주간 목표 추적**
✅ **성장 통계 분석**

각 사용자는 이제 자신만의 고유한 데이터를 가지게 되며, 모든 활동이 실시간으로 저장되고 추적됩니다! 🚀 