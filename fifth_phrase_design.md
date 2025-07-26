# 연애 박사 - 메인 홈 화면 & 대시보드 (토스 스타일)

## 📱 **Screen 20: 메인 홈 대시보드 (토스 스타일 정보 중심)**

### **토스 방법론: "가장 중요한 정보를 가장 위에"**
```
- 사용자가 지금 당장 알아야 할 정보 우선 표시
- 자주 사용하는 기능을 즉시 접근 가능하게
- 개인 성과와 목표를 명확히 시각화
- 복잡한 기능은 카드로 단순화
```

### **화면 구성**

**1. 헤더 (토스 스타일 개인화된 인사)**
```
높이: 100px
배경: White
패딩: 20px (좌우), 16px (상하)

상단 영역:
좌측: 프로필 이미지 (40x40px 원형)
중앙: 개인화된 인사말
우측: 알림 🔔 + 설정 ⚙️

인사말 (토스 스타일):
"안녕하세요, 준호님!"
- 폰트: Pretendard Bold, 20px
- 색상: #191F28

서브 텍스트:
"오늘도 대화 실력을 키워볼까요?"
- 폰트: Pretendard Regular, 14px
- 색상: #8B95A1

하단 영역:
빠른 검색바:
- 높이: 36px
- 배경: #F2F4F6
- 모서리: 18px radius
- 플레이스홀더: "AI 검색 또는 대화 주제 찾기"
- 좌측 아이콘: 🔍 (16px)
```

**2. Today Card (토스 스타일 오늘의 상황)**
```
위치: 헤더 하단 20px
높이: 140px
배경: linear-gradient(135deg, #FDF2F8, #EBF2FF)
테두리: 1px solid #F093B0
패딩: 24px
모서리: 16px radius

좌측 영역:
아이콘: 📅 (32px)
제목: "오늘의 목표"
- 폰트: Pretendard Bold, 18px
- 색상: #191F28

진행 상황:
"2/3 대화 완료"
- 폰트: Pretendard Bold, 24px
- 색상: #F093B0

진행바:
- 배경: rgba(255, 255, 255, 0.3)
- 진행: #F093B0
- 높이: 6px
- 모서리: 3px radius
- 애니메이션: 66% 채움

우측 영역:
남은 목표:
"1번 더 대화하면 목표 달성!"
- 폰트: Pretendard Medium, 14px
- 색상: #4F7ABA

Quick Action:
"바로 대화하기" 버튼
- 크기: 100x32px
- 배경: #F093B0
- 텍스트: White, Bold 14px
- 모서리: 16px radius
```

**3. Performance Card (토스 스타일 성과 추적)**
```
위치: Today Card 하단 16px
높이: 120px
배경: White
테두리: 1px solid #F2F4F6
패딩: 20px
모서리: 16px radius

헤더:
좌측: "📊 이번 주 성장"
우측: "자세히 보기 →" (#4F7ABA, 14px)

메인 지표 (토스 스타일 대형 숫자):
"+12점 향상"
- 폰트: Pretendard Bold, 28px
- 색상: #0AC5A8

서브 지표:
"지난주 대비 +15% 성장"
- 폰트: Pretendard Regular, 14px
- 색상: #8B95A1

미니 차트:
간단한 선 그래프 (7일간 점수 변화)
- 색상: #F093B0
- 크기: 150x40px
- 애니메이션: 좌측부터 그려짐

Quick Stats (3개 항목):
😊 친근함 85% | 🤔 호기심 92% | 💬 공감력 78%
- 각 항목: 12px 폰트, 아이콘 + 퍼센트
```

**4. Recommended AI Card (토스 스타일 맞춤 추천)**
```
위치: Performance Card 하단 16px
높이: 200px
배경: White
테두리: 1px solid #F2F4F6
패딩: 20px
모서리: 16px radius

헤더:
제목: "💕 오늘의 추천 AI"
부제: "지금 대화하기 좋은 친구들이에요"

추천 AI 리스트 (가로 스크롤):
각 AI 카드: 120x140px

AI 카드 구성:
- 프로필 이미지: 60x60px 원형
- 이름: "소연" (Bold 14px)
- 상태: "🟢 온라인" (12px)
- 특징: "게임 좋아함" (12px, #8B95A1)
- 매칭도: "95%" (Bold 12px, #0AC5A8)
- 대화 버튼: "대화하기" (전체 너비, 28px 높이)

배경: #F9FAFB
테두리: 1px solid #E5E8EB
모서리: 12px radius
간격: 12px

우측 끝:
"더 보기" 카드
- 배경: #F2F4F6
- 아이콘: → (24px)
- 텍스트: "전체 보기"
```

**5. Quick Actions (토스 스타일 바로가기)**
```
위치: Recommended AI 하단 16px
높이: 100px

4개 Quick Action 버튼 (2x2 그리드):
각 버튼: 전체너비/2 - 8px x 40px

버튼 1: "💬 즐겨찾기와 대화"
- 배경: #FDF2F8
- 아이콘: 💬 (20px)
- 텍스트: Bold 14px, #DB7093

버튼 2: "🎯 맞춤 연습"
- 배경: #EBF2FF
- 아이콘: 🎯 (20px)  
- 텍스트: Bold 14px, #4F7ABA

버튼 3: "📈 성장 기록"
- 배경: #F0FDF9
- 아이콘: 📈 (20px)
- 텍스트: Bold 14px, #059682

버튼 4: "🏆 내 배지"
- 배경: #FFF4E6
- 아이콘: 🏆 (20px)
- 텍스트: Bold 14px, #E67800

각 버튼:
- 모서리: 12px radius
- 패딩: 12px
- 간격: 8px
```

**6. Achievement Banner (토스 스타일 성취 알림)**
```
위치: Quick Actions 하단 16px
높이: 80px
배경: linear-gradient(90deg, #F7F4FF, #FDF2F8)
테두리: 1px solid #B794F6
패딩: 16px
모서리: 12px radius

좌측:
배지 아이콘: 🏆 (40px)

중앙:
제목: "새로운 배지 획득!"
- 폰트: Pretendard Bold, 16px
- 색상: #191F28

설명: "연속 3일 대화 달성 - '꾸준함의 달인'"
- 폰트: Pretendard Regular, 14px
- 색상: #8B95A1

우측:
"확인하기" 버튼
- 크기: 80x32px
- 배경: #B794F6
- 텍스트: White, Bold 12px
```

**7. Learning Card (토스 스타일 맞춤 학습)**
```
위치: Achievement Banner 하단 16px
높이: 160px
배경: White
테두리: 1px solid #F2F4F6
패딩: 20px
모서리: 16px radius

헤더:
제목: "📚 맞춤 학습 콘텐츠"
부제: "공감력 향상을 위한 추천 콘텐츠"

학습 아이템 리스트:

아이템 1:
아이콘: 🎥 (24px)
제목: "공감 표현 마스터하기"
설명: "상대방 감정에 적절히 반응하는 법"
시간: "5분 영상"
상태: "새로움" 빨간 점

아이템 2:
아이콘: 📖 (24px)
제목: "질문의 기술"
설명: "자연스러운 질문으로 대화 이어가기"
시간: "3분 읽기"
진행률: 진행바 60%

각 아이템:
- 높이: 50px
- 우측 화살표: → (16px, #8B95A1)
- 탭 가능한 영역
```

---

## 📱 **Screen 21: 상세 성과 화면 (토스 스타일 Analytics)**

### **Performance Card "자세히 보기" 클릭 시**

### **화면 구성**

**1. 헤더**
```
제목: "내 대화 실력 분석"
기간 선택: "이번 주 ∨" (드롭다운)
```

**2. 메인 지표 (토스 스타일 대형 표시)**
```
중앙 대형 점수:
"78점"
- 폰트: Pretendard Bold, 48px
- 색상: #F093B0

등급: "GOOD"
- 배경: #0AC5A8
- 텍스트: White, Bold 16px
- 크기: 80x28px

변화율: "+12점 (18%↗)" 
- 색상: #0AC5A8
- 폰트: Bold 20px
```

**3. 상세 차트 (토스 스타일 데이터 시각화)**
```
7일간 점수 변화:
선 그래프 + 점 마커
- X축: 날짜 (월, 화, 수...)
- Y축: 점수 (0-100)
- 색상: #F093B0
- 애니메이션: 좌측부터 그려짐

영역별 레이더 차트:
6각형 레이더 (친근함, 호기심, 공감력, 유머, 배려, 적극성)
- 채움: rgba(240, 147, 176, 0.2)
- 선: #F093B0
- 점: #DB7093
```

**4. 영역별 상세 분석**
```
각 영역 카드 (3개):

친근함 카드:
아이콘: 😊 (24px)
점수: "85점" (Bold 20px, #0AC5A8)
변화: "+8점" (14px, #0AC5A8)
설명: "인사와 첫 대화가 많이 좋아졌어요"
목표: "90점까지 5점 남았어요"

호기심 카드:
아이콘: 🤔 (24px)
점수: "92점" (Bold 20px, #0AC5A8)
변화: "+15점" (14px, #0AC5A8)
설명: "질문하는 능력이 크게 향상됐어요"
상태: "목표 달성! 🎉"

공감력 카드:
아이콘: 💬 (24px)
점수: "58점" (Bold 20px, #FF8A00)
변화: "+3점" (14px, #FF8A00)
설명: "가장 개선이 필요한 영역이에요"
액션: "맞춤 학습 보기 →"
```

**5. 대화 기록 요약**
```
이번 주 대화 통계:

총 대화 시간: "2시간 15분"
대화 횟수: "8회"
평균 대화 시간: "17분"
가장 긴 대화: "32분 (소연님과)"
선호 AI 타입: "활발한 성격 (60%)"

각 통계:
- 아이콘 + 라벨 + 수치
- 토스 스타일 카드 형태
```

---

## 📱 **Screen 22: AI 즐겨찾기 (토스 스타일 연락처)**

### **Quick Actions "즐겨찾기와 대화" 클릭 시**

### **화면 구성**

**1. 헤더**
```
제목: "즐겨찾는 AI 친구들"
부제: "자주 대화하는 AI들이에요"
편집: "편집" 버튼 (우상단)
```

**2. 즐겨찾기 AI 리스트 (토스 스타일)**
```
각 AI 항목: 전체 너비 x 80px

AI 항목 구성:
좌측: 프로필 이미지 (50x50px)
중앙: 정보 영역
우측: 액션 영역

정보 영역:
이름: "김소연" (Bold 16px)
상태: "🟢 온라인" / "⚫ 마지막 접속 2시간 전"
최근 대화: "어제 25분 대화"
관계도: "💕 친밀도 85%"

액션 영역:
"대화하기" 버튼
- 크기: 80x36px
- 배경: #F093B0
- 텍스트: White

상태별 처리:
- 온라인: 즉시 대화 가능
- 오프라인: "메시지 남기기" 
- 바쁨: "나중에 대화하기"

각 항목:
- 배경: White
- 하단 구분선: 1px solid #F2F4F6
- 좌우 스와이프: 삭제/설정
```

**3. 추천 AI (하단)**
```
제목: "이런 AI도 좋아하실 것 같아요"

미니 추천 카드들:
각 카드: 100x120px (가로 스크롤)
- 프로필 + 이름 + 특징
- "+즐겨찾기" 버튼
```

---

## 📱 **Screen 23: 내 배지 (토스 스타일 Achievement)**

### **Quick Actions "내 배지" 클릭 시**

### **화면 구성**

**1. 헤더 (토스 스타일 성과 요약)**
```
제목: "획득한 배지"

요약 정보:
"총 12개 배지 획득"
"이번 달 3개 새로 획득"
진행률: "다음 배지까지 2일 남음"
```

**2. 최근 배지 (토스 스타일 하이라이트)**
```
Featured 배지:
크기: 전체 너비 x 100px
배경: linear-gradient(135deg, #F093B0, #B794F6)

배지 정보:
아이콘: 🏆 (48px, White)
이름: "꾸준함의 달인"
설명: "7일 연속 대화 달성"
획득일: "2024.07.20"
희귀도: "⭐⭐⭐ 레어"
```

**3. 배지 카테고리 (토스 스타일 탭)**
```
탭 메뉴:
- 전체 (12)
- 대화 (8) 
- 성장 (3)
- 특별 (1)

탭 스타일:
- 높이: 44px
- 선택: #F093B0 배경, White 텍스트
- 비선택: 투명 배경, #8B95A1 텍스트
```

**4. 배지 그리드 (토스 스타일)**
```
레이아웃: 2열 그리드
각 배지: 160x140px

배지 카드:
상단: 배지 아이콘 (48px)
이름: "대화왕" (Bold 14px)
설명: "50회 대화 달성" (12px, #8B95A1)
진행률: "50/50 완료" (진행바)
상태: "완료" / "진행중" / "잠김"

상태별 스타일:
- 완료: 풀 컬러
- 진행중: 50% opacity + 진행바
- 잠김: 30% opacity + 자물쇠
```

**5. 다음 목표 (토스 스타일 동기부여)**
```
하단 고정 카드:
배경: #FDF2F8
테두리: 1px solid #F093B0

내용:
"🎯 다음 배지까지"
"대화 마스터 - 2일 후 획득 예정"
진행률: 5/7 (71%)

CTA: "지금 대화하러 가기"
```

---

## 🎨 **토스 스타일 홈 화면 시스템 특징**

### **1. 정보 우선순위 (토스 철학)**
```
가장 위: 오늘 해야 할 일 (Today Card)
두 번째: 성과와 성장 (Performance Card)  
세 번째: 추천 및 바로가기 (Recommended AI, Quick Actions)
마지막: 부가 정보 (Achievement, Learning)
```

### **2. 카드 기반 모듈화 (토스 방식)**
```
각 기능을 독립적인 카드로 분리:
- Today Card: 오늘의 목표와 진행
- Performance Card: 성과 추적
- Recommended AI Card: 맞춤 추천
- Quick Actions: 자주 사용 기능
- Achievement Banner: 성취 알림
- Learning Card: 개인화 학습
```

### **3. 즉시 액션 (토스 특징)**
```
모든 카드에서 바로 액션 가능:
- "바로 대화하기" 원탭 시작
- "자세히 보기" 상세 화면 이동
- "대화하기" 즉시 연결
- Quick Actions 4개 주요 기능
```

### **4. 개인화 (토스 방식)**
```
사용자별 맞춤 경험:
- "안녕하세요, 준호님!" 개인화된 인사
- 성과 기반 추천 AI
- 약점 기반 학습 콘텐츠 추천
- 사용 패턴 기반 Quick Actions 순서
```

### **5. 시각적 피드백 (토스 스타일)**
```
수치와 그래프로 성과 시각화:
- 대형 점수 표시 (78점)
- 진행률 바 (66% 완료)
- 미니 차트 (7일간 변화)
- 색상 코딩 (좋음/보통/나쁨)
```

## **🔧 개발팀을 위한 홈 화면 구현**

### **토스 스타일 카드 컴포넌트**
```javascript
const TossStyleCard = ({ 
  title, 
  subtitle, 
  children, 
  onPress, 
  gradient,
  style 
}) => (
  <TouchableOpacity 
    style={[styles.card, gradient && styles.gradientCard, style]}
    onPress={onPress}
    activeOpacity={0.95}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.cardContent}>
      {children}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F2F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gradientCard: {
    // 그라데이션 배경 스타일
  },
  // ... 더 많은 스타일들
});
```

### **실시간 데이터 업데이트 시스템**
```javascript
const HomeScreen = () => {
  const [todayProgress, setTodayProgress] = useState(0);
  const [weeklyGrowth, setWeeklyGrowth] = useState(0);
  const [recommendedAIs, setRecommendedAIs] = useState([]);
  
  useEffect(() => {
    // 토스 스타일 실시간 데이터 갱신
    const updateInterval = setInterval(() => {
      fetchTodayProgress();
      fetchWeeklyGrowth();
      fetchRecommendedAIs();
    }, 30000); // 30초마다 업데이트
    
    return () => clearInterval(updateInterval);
  }, []);
  
  const fetchTodayProgress = async () => {
    // 오늘의 목표 진행률 조회
    const progress = await ConversationAPI.getTodayProgress();
    setTodayProgress(progress);
  };
};
```

**다음 단계**: 이제 메인 홈 화면이 완성되었으니, 마지막으로 **설정 화면과 사용자 프로필 관리**를 토스 스타일로 설계해보겠습니다! ⚙️

사용자가 자신의 학습 목표를 관리하고, 개인 정보를 수정하며, 앱 설정을 변경할 수 있는 화면들을 만들어보죠! 🎯✨