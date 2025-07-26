# Supabase 설정 및 DB 스키마 적용 가이드

## 🔧 1단계: 환경 변수 설정

### .env.local 파일에 다음 내용 추가:
```bash
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase 프로젝트 정보 확인 방법:
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → API 메뉴에서 확인:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

## 🗄️ 2단계: DB 스키마 적용

### 방법 1: Supabase Dashboard SQL Editor 사용 (권장)
1. Supabase Dashboard → SQL Editor
2. New Query 클릭
3. `database_schema.sql` 파일 내용을 복사하여 붙여넣기
4. Run 버튼 클릭

### 방법 2: Supabase CLI 사용
```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your_project_ref

# 스키마 적용
supabase db push
```

## ✅ 3단계: 테이블 생성 확인

### Supabase Dashboard에서 확인:
1. Table Editor → Tables 메뉴
2. 다음 테이블들이 생성되었는지 확인:
   - `users`
   - `personas`
   - `conversations`
   - `messages`
   - `favorites`
   - `badges`
   - `user_badges`
   - `performance_records`
   - `notifications`
   - `user_settings`
   - `learning_goals`
   - `styling_requests`

## 🧪 4단계: 테스트 데이터 삽입

### 기본 배지 데이터 확인:
- `badges` 테이블에 8개의 기본 배지가 자동으로 삽입됨
- Table Editor → badges 테이블에서 확인

## 🔒 5단계: RLS 정책 확인

### Row Level Security 확인:
1. Table Editor → 각 테이블 선택
2. RLS가 활성화되어 있는지 확인
3. Policies 탭에서 정책들이 생성되었는지 확인

## 🚀 6단계: 앱 테스트

### 개발 서버 실행:
```bash
npm run dev
```

### 테스트할 기능들:
1. **페르소나 생성**: 맞춤 페르소나 만들기
2. **대화 기록**: 대화 후 DB 저장 확인
3. **즐겨찾기**: 페르소나 즐겨찾기 추가/제거
4. **설정**: 사용자 설정 저장/불러오기

## 🐛 문제 해결

### 일반적인 오류들:

#### 1. "Invalid API key" 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트의 API 키가 정확한지 확인

#### 2. "Table does not exist" 오류
- DB 스키마가 제대로 적용되었는지 확인
- Supabase Dashboard에서 테이블 존재 여부 확인

#### 3. "RLS policy violation" 오류
- 사용자 인증이 제대로 되어 있는지 확인
- RLS 정책이 올바르게 설정되었는지 확인

### 디버깅 방법:
```typescript
// 브라우저 콘솔에서 테스트
import { supabase } from './src/services/supabaseClient';

// 연결 테스트
const { data, error } = await supabase.from('users').select('*').limit(1);
console.log('Connection test:', { data, error });
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 환경 변수 설정
2. DB 스키마 적용 상태
3. 브라우저 콘솔 오류 메시지
4. Supabase Dashboard 로그 