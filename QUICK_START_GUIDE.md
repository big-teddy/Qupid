# 🚀 연애 박사 앱 - 빠른 시작 가이드

## 📋 현재 상태
- ✅ **앱 구조**: 완전히 리팩토링됨
- ✅ **DB 스키마**: 완전한 설계 완료
- ✅ **서비스 레이어**: 모든 기능 구현됨
- ✅ **테스트 시스템**: Mock DB로 테스트 가능
- 🔄 **실제 DB 연동**: 환경 변수 설정 필요

## 🎯 다음 단계

### 1단계: Supabase 프로젝트 설정
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Settings → API에서 다음 정보 복사:
   - Project URL
   - anon public key

### 2단계: 환경 변수 설정
`.env.local` 파일을 다음과 같이 수정:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

### 3단계: DB 스키마 적용
1. Supabase Dashboard → SQL Editor
2. `supabase_schema_ready.sql` 파일 내용 복사
3. New Query → 붙여넣기 → Run

### 4단계: 앱 테스트
```bash
npm run dev
```
브라우저에서 `http://localhost:5177` 접속

### 5단계: DB 테스트
홈 화면에서 "🧪 데이터베이스 테스트" 버튼 클릭

## 🧪 현재 테스트 가능한 기능들

### Mock 모드 (현재 상태)
- ✅ 페르소나 생성/조회
- ✅ 즐겨찾기 추가/제거
- ✅ 사용자 설정 관리
- ✅ 대시보드 데이터 조회
- ✅ 배지 시스템
- ✅ 알림 시스템

### 실제 DB 모드 (환경 변수 설정 후)
- 🔄 모든 Mock 기능 + 실제 데이터 저장
- 🔄 사용자 인증
- 🔄 실시간 데이터 동기화

## 📁 주요 파일들

### DB 관련
- `supabase_schema_ready.sql` - Supabase Dashboard용 스키마
- `src/services/` - 모든 DB 서비스 파일들
- `src/services/mockSupabaseClient.ts` - 테스트용 Mock 클라이언트

### 앱 구조
- `src/App.tsx` - 메인 앱 로직
- `src/components/DatabaseTest.tsx` - DB 테스트 컴포넌트
- `src/screens/` - 모든 화면 컴포넌트들

## 🐛 문제 해결

### 앱이 로드되지 않는 경우
```bash
npm install
npm run dev
```

### DB 연결 오류
1. 환경 변수 확인
2. Supabase 프로젝트 상태 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 테스트 실패
- Mock 모드에서는 일부 테스트가 실패할 수 있음 (정상)
- 실제 DB 연결 후 다시 테스트

## 🎉 완료된 작업들

### ✅ 앱 구조 개선
- 폴더 구조 표준화
- 컴포넌트 분리
- 타입 안전성 강화
- 코드 스타일 통일

### ✅ DB 설계
- 15개 테이블 완전 설계
- RLS 보안 정책
- 인덱스 최적화
- 트리거 자동화

### ✅ 서비스 레이어
- 8개 전용 서비스 파일
- 통합 서비스 헬퍼
- 타입 안전한 API

### ✅ 테스트 시스템
- Mock DB 클라이언트
- 자동 테스트 컴포넌트
- 실시간 결과 확인

## 🚀 배포 준비

### Vercel 배포
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포

### Netlify 배포
1. GitHub에 코드 푸시
2. Netlify에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포

---

**🎯 현재 상태: Mock 모드로 모든 기능 테스트 가능**
**🔗 다음 단계: Supabase 환경 변수 설정으로 실제 DB 연동** 