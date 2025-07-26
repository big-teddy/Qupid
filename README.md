# 연애 박사 (Love Coach) 💕

AI와 함께하는 자연스럽고 따뜻한 이성 소통 학습 앱

## 🎯 프로젝트 개요

연애 박사는 AI 기술을 활용하여 사용자가 안전하고 효과적으로 이성과의 대화를 연습할 수 있도록 도와주는 앱입니다. 사용자 여정에 따른 성취 시스템과 성장 추적을 통해 지속적인 동기부여를 제공합니다.

## ✨ 주요 기능

### 🎮 게임화된 학습 시스템
- **레벨 시스템**: 경험치 기반 레벨업 (1-10단계)
- **성취 시스템**: 10가지 다양한 성취 (대화, 성장, 연속, 특별)
- **주간 목표**: 대화 횟수, 점수, 시간 목표 설정
- **연속 사용 보상**: 3일, 7일, 30일 연속 사용 성취

### 🤖 AI 대화 시스템
- **다양한 AI 페르소나**: 8가지 기본 페르소나 + 맞춤형 생성
- **실시간 대화**: Gemini 2.5 Flash 기반 자연스러운 대화
- **대화 분석**: 친근함, 호기심, 공감 능력 분석
- **실시간 피드백**: 대화 중 즉시 피드백 제공

### 📊 성장 추적
- **통계 대시보드**: 총 대화, 평균 점수, 연속 일수
- **성과 분석**: 주간/월간 성장 추이
- **영역별 분석**: 친근함, 호기심, 공감 능력별 점수
- **개인화 추천**: 사용자 패턴 기반 AI 추천

### 🎨 사용자 경험
- **직관적 UI**: 토스/당근 스타일의 모던한 디자인
- **모바일 최적화**: 터치 인터랙션, 안전 영역 지원
- **다크모드**: 완전한 다크모드 지원
- **반응형 디자인**: 다양한 화면 크기 지원

## 🚀 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks
- **Icons**: Heroicons

## 📱 사용자 여정

### Phase 1: 첫 경험
- 온보딩 및 튜토리얼
- 첫 대화 연습
- 기본 대화법 학습

### Phase 2: 습관 형성
- 연속 사용 보상
- 주간 목표 설정
- 성장 추적 시작

### Phase 3: 실력 향상
- 점진적 레벨업
- 과학적 피드백
- 맞춤형 연습

### Phase 4: 개인화
- 이상형 페르소나 생성
- AI 스타일링 추천
- 실전 준비

### Phase 5: 실제 적용
- 실제 이성과 만남 준비
- 자신감 완성
- 지속적 동기부여

## 🛠️ 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/love-coach.git
cd love-coach
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```env
# Gemini API Key (선택사항)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (선택사항)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속하세요.

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: 파스텔 핑크 (#F093B0) - 따뜻하고 편안한 느낌
- **Secondary**: 신뢰감 블루 (#4F7ABA) - 전문성과 안정감
- **Accent**: 라벤더 (#B794F6) - 창의성과 특별함
- **Success**: 민트 그린 (#0AC5A8) - 성공과 완료
- **Warning**: 오렌지 (#FF8A00) - 주의와 진행
- **Error**: 레드 (#FF4757) - 오류와 경고

### 브랜드 철학
- **Warmth (따뜻함)**: 편안하고 안전한 연습 환경
- **Growth (성장)**: 지속적인 개인 발전과 학습
- **Authenticity (진정성)**: 자연스럽고 진실한 소통
- **Innovation (혁신)**: AI 기술로 새로운 학습 경험

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── screens/            # 화면별 컴포넌트
├── services/           # API 및 외부 서비스
├── hooks/              # 커스텀 React 훅
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
├── constants/          # 상수 및 설정
└── assets/             # 이미지, 폰트 등 정적 자원
```

## 🔧 주요 컴포넌트

### 화면 컴포넌트
- `SimplifiedHomeScreen`: 메인 홈 화면 (성취, 목표, 추천)
- `ChatTabScreen`: 대화 탭 (새 대화, 대화 내역)
- `AICoachingScreen`: AI 코칭 화면 (성과, 분석)
- `SettingsScreen`: 설정 화면
- `CustomPersonaForm`: 맞춤형 AI 생성 폼

### 공통 컴포넌트
- `BottomTabBar`: 하단 탭 네비게이션
- `Button`: 재사용 가능한 버튼
- `TossInput`: 토스 스타일 입력 필드
- `ProgressSteps`: 진행 단계 표시

## 🎯 성취 시스템

### 대화 관련 성취
- **첫 대화**: 첫 번째 대화 완료
- **대화 지속왕**: 10분 이상 자연스러운 대화
- **대화왕**: 50회 대화 달성

### 성장 관련 성취
- **공감 마스터**: 공감 능력 90점 이상
- **호기심 전문가**: 호기심 90점 이상
- **친근함 챔피언**: 친근함 90점 이상

### 연속 사용 성취
- **열정의 시작**: 3일 연속 사용
- **일주일의 기적**: 7일 연속 사용
- **한 달의 열정**: 30일 연속 사용

### 특별 성취
- **나만의 페르소나**: 맞춤형 AI 생성
- **완벽한 대화**: 100점 달성

## 📊 성장 추적

### 레벨 시스템
- **Level 1-2**: 연애 초보자
- **Level 3-4**: 연애 입문자
- **Level 5-6**: 연애 초급자
- **Level 7-8**: 연애 중급자
- **Level 9-10**: 연애 고수
- **Level 10+**: 연애 마스터

### 경험치 계산
- 기본 경험치: 50 XP
- 점수 보너스: 70점+ 10XP, 80점+ 20XP, 90점+ 30XP
- 시간 보너스: 5분+ 10XP, 10분+ 20XP
- 첫 대화 보너스: +50 XP

## 🔐 환경 변수

### 필수 (선택사항)
- `VITE_GEMINI_API_KEY`: Gemini AI API 키
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/love-coach](https://github.com/your-username/love-coach)

## 🙏 감사의 말

- [Google Gemini](https://ai.google.dev/) - AI 대화 시스템
- [Supabase](https://supabase.com/) - 데이터베이스 및 인증
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링
- [Vite](https://vitejs.dev/) - 빌드 도구

---

**연애 박사**와 함께 더 자신감 있는 대화를 시작해보세요! 💕
