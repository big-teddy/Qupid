# Google OAuth 설정 확인 가이드

## 1. Google Cloud Console 확인
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. 프로젝트 선택
3. **OAuth 2.0 클라이언트 ID** 클릭

## 2. 승인된 리디렉션 URI 확인
다음 URI들이 정확히 등록되어 있는지 확인:

```
https://oxghwastrvvqhvlggmgq.supabase.co/auth/v1/callback
http://localhost:5173/
http://localhost:5173/auth/callback
```

## 3. Supabase Dashboard 확인
1. [Supabase Dashboard](https://supabase.com/dashboard/project/oxghwastrvvqhvlggmgq) 접속
2. **Authentication** → **URL Configuration**
3. 다음 설정 확인:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: 
     - `http://localhost:5173/`
     - `http://localhost:5173/auth/callback`

## 4. Google Provider 설정 확인
1. **Authentication** → **Providers** → **Google**
2. **Enabled** 상태인지 확인
3. **Client ID**와 **Client Secret**이 올바르게 입력되어 있는지 확인

## 5. 브라우저 캐시 초기화
1. 브라우저에서 **개발자 도구** 열기 (F12)
2. **Application** 탭 → **Storage** → **Clear storage**
3. **Clear site data** 클릭
4. 브라우저 새로고침

## 6. 테스트 순서
1. 브라우저에서 `http://localhost:5173/` 접속
2. **로그아웃** (이미 로그인되어 있다면)
3. **"Google로 로그인"** 버튼 클릭
4. Google 계정 선택
5. 홈 화면에서 실제 Google 계정 이름 확인 