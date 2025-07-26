# Google OAuth 디버깅 가이드

## 현재 문제
- Google 로그인 후 사용자 이름이 "준호"로 표시됨
- 실제 Google 계정 이름이 반영되지 않음

## 해결 방법

### 1. 브라우저 개발자 도구에서 확인
1. 브라우저에서 F12 키를 눌러 개발자 도구 열기
2. **Console** 탭으로 이동
3. Google 로그인 시도
4. 다음 로그들을 확인:
   - "Starting Google OAuth login..."
   - "Google OAuth initiated successfully"
   - "Creating user profile for:"
   - "User metadata:"
   - "Profile created successfully:"

### 2. Supabase Dashboard에서 확인
1. [Supabase Dashboard](https://supabase.com/dashboard/project/oxghwastrvvqhvlggmgq) 접속
2. **Authentication** → **Users** 탭에서 사용자 목록 확인
3. **Database** → **Table Editor** → **users** 테이블에서 데이터 확인

### 3. 데이터베이스 초기화 (필요시)
Supabase Dashboard의 **SQL Editor**에서 다음 쿼리 실행:

```sql
-- 기존 사용자 데이터 삭제
DELETE FROM users WHERE email LIKE '%@gmail.com' OR email LIKE '%@google.com';

-- 확인
SELECT * FROM users;
```

### 4. Google Cloud Console 확인
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. OAuth 2.0 클라이언트 ID 확인
3. 승인된 리디렉션 URI 확인:
   - `https://oxghwastrvvqhvlggmgq.supabase.co/auth/v1/callback`
   - `http://localhost:5173/`
   - `http://localhost:5173/auth/callback`

### 5. Supabase 설정 확인
1. **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/`, `http://localhost:5173/auth/callback`
2. **Authentication** → **Providers** → **Google**
   - Enabled 상태 확인
   - Client ID와 Client Secret 확인 