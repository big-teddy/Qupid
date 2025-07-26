# 연애 박사 - 디자인 가이드 (Design System)

## 🎨 **브랜드 아이덴티티**

### **브랜드 철학**
"AI와 함께하는 자연스럽고 따뜻한 이성 소통 학습"

### **브랜드 가치**
- **Warmth (따뜻함)**: 편안하고 안전한 연습 환경
- **Growth (성장)**: 지속적인 개인 발전과 학습
- **Authenticity (진정성)**: 자연스럽고 진실한 소통
- **Innovation (혁신)**: AI 기술로 새로운 학습 경험

### **브랜드 톤 & 매너**
- **친근하고 격려적**: "당신은 충분히 매력적이에요!"
- **전문적이지만 부담스럽지 않음**: "과학적 분석 기반의 맞춤 조언"
- **긍정적이고 희망적**: "오늘보다 내일 더 자신감 있는 당신"
- **포용적**: 모든 수준의 사용자를 환영

---

## 🌈 **컬러 시스템** (연애 앱 특화 + 한국 빅테크 스타일)

### **Primary Colors**

**메인 브랜드 컬러 (파스텔 핑크)**
```
Primary Pink (연애 앱 특화 파스텔 핑크)
- Main: #F093B0 (부드러운 파스텔 핑크)
- Light: #FDF2F8 (매우 연한 배경용)
- Dark: #DB7093 (진한 강조용)

사용처: 메인 CTA 버튼, 하트 아이콘, 로맨틱한 요소
특징: 따뜻하면서도 편안한 느낌, 성별 중립적
```

**Secondary Blue (신뢰감 있는 블루)**
```
#4F7ABA (차분한 블루, 토스 스타일)
- Light: #EBF2FF (연한 배경)
- Dark: #3A5A8A (진한 강조)

사용처: 정보 표시, 분석 결과, 신뢰성 강조
특징: 전문성과 안정감 표현
```

**Accent Lavender (고급스러운 라벤더)**
```
#B794F6 (부드러운 라벤더)
- Light: #F7F4FF (연한 배경)
- Dark: #9F7AEA (진한 강조)

사용처: 특별한 기능, 프리미엄 요소 (제한적 사용)
특징: 창의성과 특별함 표현
```

### **Secondary Colors (기능적 색상)**

**Success Green (토스 성공 컬러 스타일)**
```
#0AC5A8 (민트 그린)
- Light: #E6F9F6
- Dark: #059682

사용처: 성공 메시지, 완료 상태, 긍정 피드백
```

**Warning Orange (당근 스타일 경고)**
```
#FF8A00 (당근 오렌지 톤다운)
- Light: #FFF4E6
- Dark: #E67800

사용처: 주의 메시지, 진행 중 상태, 중요 알림
```

**Error Red (절제된 에러 컬러)**
```
#FF4757 (차분한 레드)
- Light: #FFE8EA
- Dark: #E6404E

사용처: 오류 메시지, 삭제 액션, 경고
```

### **Neutral Colors (토스/당근 스타일 그레이 시스템)**

**Light Mode**
```
- Surface: #FFFFFF (순백)
- Background: #F9FAFB (토스 스타일 매우 연한 회색)
- Card: #FFFFFF (카드 배경)
- Border: #E5E8EB (토스 스타일 테두리)
- Divider: #F2F4F6 (구분선)
- Text Primary: #191F28 (토스 스타일 거의 검정)
- Text Secondary: #8B95A1 (중간 회색)
- Text Tertiary: #B0B8C1 (연한 회색)
- Text Disabled: #D1D6DB (비활성 텍스트)
```

**Dark Mode**
```
- Surface: #17171C (쏘카 스타일 다크 표면)
- Background: #0E0E12 (매우 어두운 배경)
- Card: #1F1F25 (다크 카드)
- Border: #2C2C35 (다크 테두리)
- Divider: #26262E (구분선)
- Text Primary: #FFFFFF (순백)
- Text Secondary: #9CA4AB (중간 회색)
- Text Tertiary: #6C7680 (어두운 회색)
- Text Disabled: #4E5968 (비활성 텍스트)
```

### **Glass & Overlay (매우 절제된 사용)**
```
Glass Background: rgba(255, 255, 255, 0.04) (매우 미묘)
Glass Border: rgba(255, 255, 255, 0.08) (매우 연함)
Modal Backdrop: rgba(0, 0, 0, 0.4) (반투명 배경)
Overlay: rgba(0, 0, 0, 0.6) (진한 오버레이)
```

---

## ✍️ **타이포그래피**

### **Font Family**

**Primary Font (영문)**
```
iOS: SF Pro Display
Android: Roboto
Web: Inter

특징: 모던하고 읽기 쉬운 산세리프
```

**Secondary Font (한글)**
```
Pretendard
- 한글 최적화 폰트
- 높은 가독성
- 다양한 font-weight 지원
```

**Accent Font (특별한 용도)**
```
Poppins (영문 전용)
- 헤드라인, 로고에 사용
- 둥글고 친근한 느낌
```

### **Typography Scale**

**Heading Styles**
```
H1 (Page Title)
- Size: 32px
- Weight: Bold (700)
- Line Height: 40px
- Letter Spacing: -0.5px
- 사용처: 페이지 메인 타이틀

H2 (Section Title)  
- Size: 24px
- Weight: SemiBold (600)
- Line Height: 32px
- Letter Spacing: -0.3px
- 사용처: 섹션 제목, 카드 헤더

H3 (Subsection)
- Size: 20px
- Weight: SemiBold (600)
- Line Height: 28px
- Letter Spacing: -0.2px
- 사용처: 서브섹션, 중요 정보

H4 (Component Title)
- Size: 18px
- Weight: Medium (500)
- Line Height: 24px
- Letter Spacing: 0px
- 사용처: 컴포넌트 제목, 폼 라벨
```

**Body Text Styles**
```
Body Large
- Size: 16px
- Weight: Regular (400)
- Line Height: 24px (1.5)
- 사용처: 메인 본문, 중요한 설명

Body Medium
- Size: 14px
- Weight: Regular (400)
- Line Height: 20px (1.43)
- 사용처: 일반 본문, 설명 텍스트

Body Small
- Size: 12px
- Weight: Regular (400)
- Line Height: 16px (1.33)
- 사용처: 캡션, 부가 정보
```

**UI Text Styles**
```
Button Large
- Size: 16px
- Weight: SemiBold (600)
- Letter Spacing: 0.1px
- 사용처: 주요 CTA 버튼

Button Medium
- Size: 14px
- Weight: Medium (500)
- Letter Spacing: 0.1px
- 사용처: 보조 버튼, 태그

Label
- Size: 12px
- Weight: Medium (500)
- Letter Spacing: 0.5px
- Transform: Uppercase
- 사용처: 폼 라벨, 상태 표시
```

### **Text Color Usage**
```
Primary Text: 중요한 내용, 제목
Secondary Text: 설명, 부가 정보
Disabled Text: 비활성 상태
Link Text: 클릭 가능한 텍스트
Error Text: 오류 메시지
Success Text: 성공 메시지
```

---

## 🎯 **아이콘 시스템**

### **아이콘 스타일**
```
기본 스타일: Outline (선형)
강조 스타일: Filled (채움)
크기: 16px, 20px, 24px, 32px
두께: 1.5px (Outline), 2px (강조용)
모서리: Rounded (2px radius)
```

### **아이콘 카테고리**

**Navigation Icons**
```
- arrow-left: 뒤로가기
- arrow-right: 다음으로
- home: 홈 화면
- user: 프로필
- settings: 설정
- menu: 메뉴
```

**Action Icons**
```
- heart: 좋아요, 관심
- chat: 대화하기
- send: 전송
- edit: 편집
- delete: 삭제
- share: 공유
- download: 다운로드
```

**Status Icons**
```
- check: 완료, 성공
- x: 닫기, 취소
- alert-circle: 경고
- info: 정보
- help-circle: 도움말
- star: 평점, 즐겨찾기
```

**Social Icons**
```
- phone: 전화
- message: 메시지
- mail: 이메일
- google: 구글 로그인
- apple: 애플 로그인
```

### **아이콘 사용 규칙**
```
1. 텍스트와 함께 사용 시 4px 간격
2. 버튼 내 아이콘은 텍스트 좌측 배치
3. 터치 영역은 최소 44x44px
4. 중요도에 따라 Outline/Filled 선택
5. 색상은 브랜드 컬러 시스템 준수
```

---

## 🧩 **컴포넌트 라이브러리**

### **Button Components (연애 앱 맞춤 스타일)**

**Primary Button (파스텔 핑크 메인)**
```
배경: #F093B0 (부드러운 파스텔 핑크)
텍스트: White, SemiBold 16px
높이: 56px (토스 스타일 큰 터치 영역)
패딩: 0px (전체 너비)
모서리: 12px radius
그림자: 없음 (flat design)

States:
- Default: #F093B0
- Hover: #F5A8C1 (밝게)
- Pressed: #DB7093 (어둡게) + scale(0.99)
- Disabled: #D1D6DB 배경 + #8B95A1 텍스트

사용처: 주요 액션 (대화하기, 시작하기, 완료하기)
```

**Heart Button (특별한 좋아요 버튼)**
```
배경: #FDF2F8 (매우 연한 핑크)
테두리: 1px solid #F093B0
아이콘: ❤️ #F093B0
크기: 48x48px (정사각형)
모서리: 24px radius (원형에 가깝게)

States:
- Default: 빈 하트 아이콘
- Active: 채워진 하트 + #F093B0 배경
- Animation: 하트 펄스 효과 (scale: 1.0 → 1.1 → 1.0)

사용처: 페르소나 좋아요, 즐겨찾기
```

**Secondary Button (차분한 블루)**
```
배경: #EBF2FF (연한 블루 배경)
테두리: 1px solid #4F7ABA
텍스트: #4F7ABA, SemiBold 16px
높이: 56px
모서리: 12px radius

사용처: 보조 액션 (건너뛰기, 나중에, 취소)
```

**Ghost Button (미니멀)**
```
배경: Transparent
텍스트: #4F7ABA, Medium 16px
높이: 44px
패딩: 12px 16px
모서리: 8px radius

States:
- Hover: 배경 rgba(79, 122, 186, 0.04)
- Pressed: 배경 rgba(79, 122, 186, 0.08)

사용처: 링크, 부가 액션
```

### **Input Components (한국 빅테크 스타일)**

**Text Input (토스 스타일)**
```
배경: #F9FAFB (연한 회색 배경)
테두리: 1px solid #E5E8EB
텍스트: Body Large (16px)
높이: 56px (큰 터치 영역)
패딩: 16px
모서리: 12px radius
플레이스홀더: #8B95A1

States:
- Focus: 테두리 #3182F6, 배경 White
- Error: 테두리 #FF4757, 배경 #FFF4F4
- Success: 테두리 #0AC5A8, 배경 #F0FDF9
- Disabled: 배경 #F2F4F6, 텍스트 #D1D6DB
```

**Search Input (당근 스타일)**
```
좌측 아이콘: search (20px, #8B95A1)
배경: #F2F4F6
테두리: 없음
높이: 44px
모서리: 22px radius (pill 형태)
패딩: 12px 16px 12px 44px
```

**Floating Label Input (쏘카 스타일)**
```
라벨이 위로 올라가는 애니메이션
배경: White
테두리: 1px solid #E5E8EB
높이: 56px
모서리: 8px radius
애니메이션: 200ms ease-out
```

### **Card Components (연애 앱 특화 스타일)**

**Persona Card (매력적이지만 절제된)**
```
배경: White
높이: 420px (적당한 크기)
너비: 300px
모서리: 20px radius (부드러운 느낌)
그림자: 0 4px 12px rgba(240, 147, 176, 0.08) (핑크 톤 그림자)
패딩: 20px

구성:
- 상단: 프로필 이미지 (180x180px, 16px radius)
- 이름/나이: 파스텔 핑크 포인트 컬러
- 중간: 직업, MBTI, 한줄 소개
- 하단: 하트 버튼 + "대화하기" 버튼

특별 효과:
- 호버 시 매우 미묘한 핑크 글로우
- 선택 시 테두리 #F093B0
```

**Chat Bubble (대화 특화)**
```
내 메시지:
- 배경: #F093B0 (파스텔 핑크)
- 텍스트: White
- 모서리: 18px radius (좌상단 6px만 작게)
- 정렬: 우측

상대방 메시지:
- 배경: #F9FAFB (연한 회색)
- 텍스트: #191F28
- 모서리: 18px radius (우상단 6px만 작게)
- 정렬: 좌측

특별 메시지 (시스템):
- 배경: #FDF2F8 (매우 연한 핑크)
- 테두리: 1px solid #F093B0
- 중앙 정렬
```

**Progress Card (성장 표시)**
```
배경: White
테두리: 1px solid #F2F4F6
모서리: 16px radius
패딩: 20px

진행 바:
- 배경: #F2F4F6
- 채움: linear-gradient(90deg, #F093B0, #B794F6)
- 높이: 8px
- 모서리: 4px radius

레벨 표시:
- 배경: #FDF2F8
- 텍스트: #DB7093
- 배지 형태
```

### **Modal Components**

**Bottom Sheet**
```
배경: White (rounded top corners 20px)
최대 높이: 화면의 90%
드래그 핸들: 4px 높이, 40px 너비, #E9ECEF
패딩: 20px
```

**Alert Modal**
```
배경: White
너비: 320px (모바일), 400px (데스크톱)
모서리: 16px radius
패딩: 24px
중앙 정렬
백드롭: rgba(0, 0, 0, 0.5)
```

---

## ⚡ **인터랙션 가이드**

### **애니메이션 원칙 (한국 빅테크 스타일)**

**Easing Functions (절제된 애니메이션)**
```
Ease Out: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- 사용처: 요소 등장, 부드러운 전환

Ease In Out: cubic-bezier(0.4, 0, 0.2, 1)
- 사용처: 상태 변화, 크기 조절

Linear: linear
- 사용처: 로딩 바, 진행률 표시

Spring (매우 제한적 사용): cubic-bezier(0.68, -0.55, 0.265, 1.55)
- 사용처: 특별한 성공 애니메이션만
```

**Duration Guidelines (빠르고 자연스럽게)**
```
Micro-interactions: 150ms
- 버튼 hover, 포커스 변화

Quick transitions: 200ms
- 탭 전환, 상태 변화

Standard transitions: 300ms
- 페이지 전환, 모달 열기

Complex animations: 400ms (최대)
- 복잡한 레이아웃 변화

Loading states: 무한 반복 (부드럽게)
```

### **Micro-interactions (토스/당근 스타일)**

**Button Interactions (매우 절제됨)**
```
Hover: scale(1.01) (거의 감지되지 않을 정도)
Press: scale(0.99) + opacity(0.8)
Disabled: opacity(0.4)
Loading: 미니멀한 스피너 + 텍스트 유지
```

**Card Interactions (자연스럽게)**
```
Hover: translateY(-2px) + 그림자 살짝 증가
Press: scale(0.995)
Focus: 테두리 컬러 변경만
```

**Input Interactions (토스 스타일)**
```
Focus: 테두리 컬러 + 배경 색 변화
Valid: 아이콘 없이 테두리 컬러만
Invalid: 테두리 컬러 + 미묘한 쉐이크 (5px 이내)
```

### **Haptic Feedback (최소한으로)**

**Light Haptic (매우 제한적 사용)**
```
사용처: 중요한 버튼 탭, 성공적인 액션 완료
구현: ImpactFeedbackStyle.Light
빈도: 꼭 필요한 경우만
```

**Medium Haptic (거의 사용 안 함)**
```
사용처: 레벨업, 매우 중요한 성취
구현: ImpactFeedbackStyle.Medium
빈도: 특별한 순간만
```

**Heavy Haptic (사용 금지)**
```
사용처: 없음 (너무 강함)
이유: 사용자 경험을 방해할 수 있음
```

---

## 📱 **레이아웃 시스템 (한국 빅테크 스타일)**

### **Grid System (토스 스타일)**

**기본 그리드**
```
Base Unit: 4px (더 섬세한 조정)
주요 Spacing: 4px, 8px, 12px, 16px, 20px, 24px, 32px
큰 Spacing: 40px, 48px, 56px
```

**Spacing Scale (토스/당근 참고)**
```
xxs: 4px (매우 작은 간격)
xs: 8px (작은 간격)
sm: 12px (컴팩트한 간격)
md: 16px (기본 간격)
lg: 20px (편안한 간격)
xl: 24px (큰 간격)
xxl: 32px (섹션 간격)
xxxl: 48px (페이지 간격)
```

**Container Sizes**
```
Mobile: 100% - 32px (양쪽 16px 마진)
Tablet: 100% - 48px (양쪽 24px 마진)
Desktop: 1200px max-width + 중앙 정렬
```

### **Safe Areas (한국 앱 표준)**
```
iOS Safe Area Top: 44px (Dynamic Island 고려)
iOS Safe Area Bottom: 34px (home indicator)
Android Status Bar: 24px
Android Navigation: 48px (gesture navigation)
Side Padding: 16px (최소), 20px (권장)
```

---

## 🎭 **일러스트레이션 가이드 (절제된 스타일)**

### **일러스트 스타일 (토스/당근 스타일)**

**캐릭터 스타일**
```
스타일: 미니멀한 2.5D, 과하지 않은 형태
색상: 브랜드 컬러 + 많은 화이트 스페이스
표정: 자연스럽고 차분한 미소
비율: 현실적 비율, 과장되지 않음
배경: 대부분 투명 또는 단색
```

**AI 페르소나 이미지**
```
스타일: 사실적이지만 친근한 일러스트
다양성: 다양한 외모, 직업 반영
일관성: 동일한 그리기 스타일과 컬러톤
크기: 400x400px (적당한 해상도)
포맷: PNG (투명 배경)
컬러톤: 따뜻하지만 과하지 않은 색상
```

### **아이콘 일러스트 (미니멀)**
```
감정 표현: 😊🤔💪👍❤️ (기본적인 것만)
스타일: iOS/Material Design과 유사
사용처: 꼭 필요한 경우만
크기: 20px, 24px (크지 않게)
컬러: 단색 또는 매우 절제된 색상
```

### **배경 그래픽 (거의 사용 안 함)**
```
패턴: 매우 미묘한 기하학적 패턴
색상: 브랜드 컬러의 2% opacity (거의 보이지 않게)
사용처: 빈 상태 화면만
스타일: 매우 추상적, 방해하지 않는 수준
```
스타일: Apple/Google 이모지와 유사
사용처: 설문, 피드백, 상태 표시
크기: 24px, 32px, 48px
```

### **배경 그래픽**
```
패턴: 미묘한 기하학적 패턴
색상: 브랜드 컬러의 5% opacity
사용처: 빈 상태, 로딩 화면
스타일: 추상적, 방해하지 않는 수준
```

---

## 🌐 **다크 모드 가이드**

### **컬러 어댑테이션**

**Surface Colors**
```
Light Mode → Dark Mode
White (#FFFFFF) → Dark Surface (#1C1C1E)
Light Gray (#F8F9FA) → Pure Black (#000000)
Card White → Dark Card (#2C2C2E)
```

**Text Colors**
```
Black (#212529) → White (#FFFFFF)
Dark Gray (#6C757D) → Light Gray (#98989F)
Medium Gray (#ADB5BD) → Dark Gray (#48484A)
```

**Brand Colors**
```
Primary Pink: 동일 유지 (#FF6B9D)
Primary Blue: 약간 밝게 (#7B83FF)
Success: 약간 밝게 (#10E4BC)
Warning: 동일 유지 (#FFB800)
Error: 약간 밝게 (#FF6969)
```

### **이미지 어댑테이션**
```
일러스트: 다크 모드용 별도 버전 제작
사진: 자동 밝기 조절 필터 적용
아이콘: 색상 반전 또는 별도 다크 버전
```

---

## ♿ **접근성 가이드**

### **색상 접근성**

**대비 비율 (WCAG 2.1 AA 기준)**
```
일반 텍스트: 4.5:1 이상
큰 텍스트 (18px+): 3:1 이상
UI 요소: 3:1 이상
```

**색맹 고려사항**
```
빨간색-초록색 색맹: 빨강/초록 외에 추가 구별 요소
파란색-노란색 색맹: 파랑/노랑 외에 추가 구별 요소
색상에만 의존하지 않는 정보 전달
```

### **터치 접근성**
```
최소 터치 영역: 44x44px
터치 요소 간 간격: 8px 이상
스와이프 제스처 대안 제공
```

### **텍스트 접근성**
```
동적 텍스트 크기 지원
Screen Reader 지원
accessibilityLabel 제공
적절한 heading 구조
```

---

## 📏 **품질 체크리스트**

### **디자인 일관성**
```
☐ 브랜드 컬러 시스템 준수
☐ 타이포그래피 스케일 적용
☐ 8px 그리드 시스템 사용
☐ 컴포넌트 재사용성 확보
☐ 일관된 간격과 여백
```

### **사용성**
```
☐ 명확한 시각적 계층 구조
☐ 충분한 터치 영역 확보
☐ 직관적인 내비게이션
☐ 적절한 피드백 제공
☐ 로딩 상태 표시
```

### **접근성**
```
☐ 색상 대비 비율 충족
☐ Screen Reader 호환성
☐ 키보드 내비게이션 지원
☐ 동적 텍스트 크기 대응
☐ 다양한 능력의 사용자 고려
```

### **성능**
```
☐ 최적화된 이미지 사용
☐ 불필요한 애니메이션 제거
☐ 효율적인 컴포넌트 구조
☐ 메모리 사용량 최적화
☐ 배터리 효율성 고려
```

---

## 🛠️ **디자인 도구 및 리소스**

### **디자인 도구**
```
Figma: UI/UX 디자인, 프로토타이핑
Sketch: UI 디자인 (macOS)
Adobe XD: 디자인, 프로토타이핑
Principle: 고급 애니메이션 프로토타이핑
```

### **색상 도구**
```
Coolors.co: 색상 팔레트 생성
Contrast Checker: 접근성 대비 검사
Adobe Color: 색상 조합 도구
```

### **폰트 리소스**
```
Google Fonts: Pretendard, Inter
Apple Fonts: SF Pro Display
Font Squirrel: 웹폰트 최적화
```

### **아이콘 리소스**
```
Lucide Icons: 오픈소스 아이콘 세트
Heroicons: 심플한 SVG 아이콘
Phosphor Icons: 다양한 스타일
Tabler Icons: 아웃라인 아이콘
```

### **애니메이션 도구**
```
Lottie: After Effects 애니메이션 변환
Rive: 인터랙티브 애니메이션
Framer Motion: React 애니메이션
```

---

## 🎯 **브랜드 적용 예시**

### **로고 사용법**
```
최소 크기: 24px (모바일), 32px (데스크톱)
여백: 로고 높이의 50% 이상
배경: 충분한 대비 확보
변형 금지: 비율 변경, 회전, 그림자 추가 금지
```

### **메시지 톤**
```
긍정적: "훌륭해요!" "잘하고 있어요!"
격려적: "다음에는 더 잘할 거예요"
전문적: "AI 분석 결과에 따르면"
친근한: "오늘 어떤 대화를 해볼까요?"
```

### **사용 금지 사항**
```
❌ 브랜드 컬러 임의 변경
❌ 폰트 스케일 무시
❌ 그리드 시스템 벗어남
❌ 과도한 애니메이션 사용
❌ 접근성 가이드라인 위반
```

**이 디자인 가이드를 통해 연애 박사 앱의 모든 화면과 컴포넌트가 일관된 브랜드 경험을 제공할 수 있습니다! 🎨✨**