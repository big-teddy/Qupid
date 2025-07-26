# 🚀 Vercel 배포 가이드

## 📋 **배포 전 체크리스트**

### ✅ **완료된 작업**
- [x] 프로덕션 빌드 테스트 (`npm run build`)
- [x] Vercel 설정 파일 생성 (`vercel.json`)
- [x] package.json 업데이트 (프로젝트명, 버전, 빌드 스크립트)
- [x] 환경 변수 설정 준비

### 🔧 **배포 전 준비사항**

#### 1. **환경 변수 준비**
다음 값들을 준비해주세요:

```bash
# Supabase 설정
VITE_SUPABASE_URL=https://oxghwastrvvqhvlggmgq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### 2. **Supabase 프로덕션 설정**
- [ ] Supabase Dashboard에서 프로덕션 URL 확인
- [ ] Google OAuth 리디렉션 URI 업데이트 (프로덕션 도메인 추가)
- [ ] RLS 정책 테스트

## 🚀 **Vercel 배포 단계**

### **1단계: Vercel CLI 설치**
```bash
npm install -g vercel
```

### **2단계: Vercel 로그인**
```bash
vercel login
```

### **3단계: 프로젝트 배포**
```bash
vercel
```

### **4단계: 환경 변수 설정**
Vercel Dashboard에서 다음 환경 변수들을 설정:

1. **Vercel Dashboard** → **프로젝트** → **Settings** → **Environment Variables**
2. 다음 변수들을 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://oxghwastrvvqhvlggmgq.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key` | Production, Preview, Development |
| `VITE_GEMINI_API_KEY` | `your_gemini_api_key` | Production, Preview, Development |

### **5단계: 도메인 설정**
1. **Vercel Dashboard** → **프로젝트** → **Settings** → **Domains**
2. 커스텀 도메인 추가 (선택사항)

## 🔄 **자동 배포 설정**

### **GitHub 연동**
1. **Vercel Dashboard** → **프로젝트** → **Settings** → **Git**
2. GitHub 저장소 연결
3. **main** 브랜치에 푸시할 때마다 자동 배포

### **배포 트리거**
- `main` 브랜치 푸시 → 자동 배포
- Pull Request → Preview 배포

## 🔧 **배포 후 설정**

### **1. Google OAuth 리디렉션 URI 업데이트**
Google Cloud Console에서 다음 URI 추가:
```
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/
```

### **2. Supabase 리디렉션 URL 업데이트**
Supabase Dashboard → **Authentication** → **URL Configuration**:
```
Site URL: https://your-vercel-domain.vercel.app
Redirect URLs:
- https://your-vercel-domain.vercel.app/
- https://your-vercel-domain.vercel.app/auth/callback
```

### **3. 데이터베이스 연결 테스트**
배포된 사이트에서:
1. 회원가입/로그인 테스트
2. Google OAuth 테스트
3. 대화 기능 테스트
4. 데이터 저장 테스트

## 🐛 **문제 해결**

### **빌드 실패**
```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 로그 확인
vercel --debug
```

### **환경 변수 문제**
```bash
# 환경 변수 확인
vercel env ls

# 환경 변수 추가
vercel env add VITE_SUPABASE_URL
```

### **라우팅 문제**
- `vercel.json`의 routes 설정 확인
- SPA 라우팅이 제대로 작동하는지 확인

## 📊 **배포 후 모니터링**

### **Vercel Analytics**
- **Vercel Dashboard** → **프로젝트** → **Analytics**
- 페이지뷰, 성능, 오류 모니터링

### **Supabase 모니터링**
- **Supabase Dashboard** → **Logs**
- 데이터베이스 쿼리, 인증 로그 확인

## 🔒 **보안 체크리스트**

- [ ] 환경 변수가 올바르게 설정됨
- [ ] API 키가 노출되지 않음
- [ ] RLS 정책이 활성화됨
- [ ] HTTPS 리디렉션이 설정됨

## 📞 **지원**

배포 중 문제가 발생하면:
1. Vercel 로그 확인
2. 브라우저 개발자 도구 확인
3. Supabase 로그 확인
4. 환경 변수 재확인

---

**배포가 완료되면 팀원들과 공유하고 테스트를 진행해주세요!** 🎉 