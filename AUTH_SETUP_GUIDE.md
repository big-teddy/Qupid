# 🔐 인증 시스템 설정 가이드

연애 박사 앱의 사용자 맞춤형 경험을 위한 인증 시스템 설정 방법입니다.

## 📋 개요

이 앱은 Supabase를 사용하여 다음 인증 기능을 제공합니다:
- 이메일/비밀번호 로그인
- 회원가입
- 자동 로그인 유지
- 비밀번호 재설정
- 사용자 프로필 관리

## 🚀 Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트를 생성합니다.
2. 프로젝트 이름을 "연애-박사" 또는 원하는 이름으로 설정합니다.
3. 데이터베이스 비밀번호를 설정하고 지역을 선택합니다.

### 2. 인증 설정

#### Authentication > Settings에서:
1. **Site URL**: `http://localhost:5173` (개발용)
2. **Redirect URLs**: `http://localhost:5173/**`
3. **Enable email confirmations**: 비활성화 (개발용)
4. **Enable email change confirmations**: 비활성화 (개발용)

#### Authentication > Providers에서:
1. **Email**: 활성화
2. **Confirm email**: 비활성화 (개발용)

### 3. 데이터베이스 스키마 설정

SQL Editor에서 다음 스크립트를 실행합니다:

```sql
-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  user_gender TEXT CHECK (user_gender IN ('male', 'female')),
  experience TEXT,
  confidence TEXT,
  difficulty TEXT,
  interests TEXT[],
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  average_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 읽고 수정할 수 있음
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 사용자 생성 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, user_gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '사용자'),
    NEW.raw_user_meta_data->>'user_gender'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Key (선택사항)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Supabase URL과 Anon Key 찾는 방법:
1. Supabase 프로젝트 대시보드에서 **Settings** > **API**로 이동
2. **Project URL**과 **anon public** 키를 복사

## 🔧 인증 기능

### 로그인
- 이메일과 비밀번호로 로그인
- 자동 로그인 유지
- 오류 메시지 표시

### 회원가입
- 이름, 이메일, 비밀번호, 성별 입력
- 비밀번호 확인
- 실시간 유효성 검사

### 사용자 프로필
- 자동 프로필 생성
- 사용자 정보 저장
- 성장 데이터 추적

## 🎯 사용자 여정

1. **앱 시작**: 스플래시 화면
2. **인증 확인**: 로그인 상태 확인
3. **로그인/회원가입**: 인증 화면
4. **온보딩**: 첫 사용자 프로필 설정
5. **메인 앱**: 인증된 사용자 경험

## 🔒 보안 고려사항

### 개발 환경
- 이메일 확인 비활성화
- 로컬호스트 리다이렉트 허용
- 디버그 모드 활성화

### 프로덕션 환경
- 이메일 확인 활성화
- HTTPS 리다이렉트 설정
- 보안 헤더 설정
- RLS 정책 검토

## 🐛 문제 해결

### 일반적인 문제들:

1. **인증 오류**
   - 환경 변수 확인
   - Supabase URL/키 확인
   - 네트워크 연결 확인

2. **프로필 생성 실패**
   - 데이터베이스 스키마 확인
   - RLS 정책 확인
   - 트리거 함수 확인

3. **세션 유지 실패**
   - 브라우저 쿠키 설정 확인
   - 로컬 스토리지 권한 확인

## 📱 테스트

### 로그인 테스트:
1. 회원가입으로 새 계정 생성
2. 로그아웃 후 다시 로그인
3. 브라우저 새로고침 후 자동 로그인 확인

### 프로필 테스트:
1. 온보딩 완료 후 프로필 데이터 확인
2. 설정에서 프로필 수정
3. 데이터베이스에서 프로필 저장 확인

## 🚀 배포 시 고려사항

1. **환경 변수 업데이트**
   - 프로덕션 Supabase URL
   - 도메인별 리다이렉트 URL

2. **보안 설정**
   - 이메일 확인 활성화
   - HTTPS 강제 적용
   - CSP 헤더 설정

3. **성능 최적화**
   - 코드 스플리팅
   - 번들 크기 최적화
   - 캐싱 전략

---

이제 사용자 맞춤형 경험을 위한 완전한 인증 시스템이 준비되었습니다! 🎉 