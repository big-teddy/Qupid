# 서비스 마이그레이션 가이드 (Service Migration Guide)

이 문서는 Qupid 프로젝트의 서비스(Supabase, Railway, Vercel)를 새로운 계정으로 이전하는 방법을 설명합니다.

## 1. Supabase 이전

### 1-1. 새 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 새 계정으로 로그인합니다.
2. **New Project**를 클릭하여 새 프로젝트를 생성합니다.
3. 데이터베이스 비밀번호를 잘 기록해둡니다.

### 1-2. 환경 변수 및 설정 가져오기

1. 생성된 프로젝트의 **Project Settings > API**로 이동합니다.
2. `Project URL`, `anon public key`, `service_role secret` 값을 복사합니다.
3. 프로젝트 루트의 `.env` 파일(또는 `.env.production`)을 열어 값을 업데이트합니다.
   ```env
   # .env 예시
   SUPABASE_URL=https://새-프로젝트-ID.supabase.co
   SUPABASE_ANON_KEY=새-anon-key
   SUPABASE_SERVICE_ROLE_KEY=새-service-role-key
   ```

### 1-3. 데이터베이스 마이그레이션 (DB 구조 복사)

로컬에서 Supabase CLI를 사용하여 DB 스키마를 새 프로젝트로 푸시합니다.

1. Supabase CLI 로그인 (아직 안 했다면):
   ```bash
   npx supabase login
   ```
2. 새 프로젝트와 로컬 연결:

   ```bash
   # 프로젝트 Reference ID는 설정 > General에서 확인 가능 (예: zwqpruk...)
   npx supabase link --project-ref 새-프로젝트-REF-ID
   ```

   _비밀번호 입력 요청 시 1-1에서 설정한 DB 비밀번호 입력_

3. DB 스키마 푸시:
   ```bash
   npx supabase db push
   ```

## 2. Railway 이전 (Backend)

### 2-1. 새 프로젝트 설정

1. [Railway Dashboard](https://railway.app/)에 새 계정으로 로그인합니다.
2. **New Project** > **Provision PostgreSQL** (필요시) 또는 **Empty Project** 선택.
3. **GitHub Repo** 선택 > `big-teddy/Qupid` 리포지토리 연결.

### 2-2. 환경 변수 설정

1. 대시보드에서 해당 서비스 선택 > **Variables** 탭 이동.
2. 기존 Railway 프로젝트의 환경 변수를 참고하여 똑같이 입력합니다.
   - Supabase 관련 변수들은 **1-2**에서 얻은 **새로운 값**으로 입력해야 합니다.
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY` 등.

### 2-3. 로컬 CLI 재연결 (선택 사항)

로컬에서 Railway CLI를 쓴다면:

```bash
railway logout
railway login
railway list # 프로젝트 확인
railway link # 새 프로젝트 선택
```

## 3. Vercel 이전 (Frontend)

### 3-1. 새 프로젝트 배포

1. [Vercel Dashboard](https://vercel.com/)에 새 계정으로 로그인합니다.
2. **Add New...** > **Project** 선택.
3. `big-teddy/Qupid` 리포지토리 Import.

### 3-2. 환경 변수 설정

1. **Environment Variables** 섹션을 펼칩니다.
2. 필요한 환경 변수를 입력합니다.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (백엔드 URL, 예: https://your-railway-app.app/api/v1)
3. **Deploy** 클릭.

### 3-3. 로컬 CLI 재연결 (선택 사항)

```bash
vercel login
vercel link
# 기존 설정 덮어쓰기(Y) 후 새 프로젝트 선택
```

## 요약

| 서비스       | 주요 작업                      | 주의사항                                    |
| ------------ | ------------------------------ | ------------------------------------------- |
| **Git**      | `git remote set-url`           | 새 repo가 비어있지 않으면 force push 필요   |
| **Supabase** | `supabase link`, `db push`     | DB 비밀번호 기억 필수, env 파일 업데이트    |
| **Railway**  | GitHub 연결, 환경변수 업데이트 | Supabase 값이 바뀌었으므로 꼭 업데이트      |
| **Vercel**   | GitHub 연결, 환경변수 업데이트 | Build Settings(Pre-install Command 등) 확인 |
