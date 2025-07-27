import { Persona, TutorialStep, UserProfile, PerformanceData, Badge, Achievement, WeeklyGoal } from '../types';

export const PREDEFINED_PERSONAS: Persona[] = [
  // Female Personas
  {
    id: 'f1',
    name: '김소연',
    age: 23,
    gender: 'female',
    job: '대학생',
    mbti: 'ENFP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/01.png',
    intro: '게임하고 영화 보는 걸 좋아해요 ✨',
    tags: ['게임', '영화', '활발함'],
    matchRate: 95,
    systemInstruction: 'You are 김소연, a 23-year-old female university student with an ENFP personality. You are bubbly, curious, and love talking about games (especially RPGs) and movies (Marvel and romance). You are very friendly and try to make the user feel comfortable. Use a bright and cheerful tone. Use Korean.',
    personalityTraits: ["외향적", "호기심많음", "긍정적", "에너지넘침", "공감능력"],
    interests: [
      { emoji: "🎮", topic: "게임", description: "RPG, 어드벤처 장르 좋아해요" },
      { emoji: "🎬", topic: "영화", description: "마블 영화와 로맨스 영화 즐겨봐요" },
      { emoji: "☕", topic: "카페", description: "예쁜 카페 찾아다니는 걸 좋아해요" },
      { emoji: "🎵", topic: "음악", description: "K-pop과 팝송 들어요" }
    ],
    conversationPreview: [
      { sender: 'ai', text: '안녕하세요! 처음 뵙네요 😊' },
      { sender: 'ai', text: '혹시 게임 좋아하세요? 저는 요즘 발로란트에 빠져있어요!' }
    ]
  },
  {
    id: 'f2',
    name: '이미진',
    age: 25,
    gender: 'female',
    job: '도서관 사서',
    mbti: 'ISFJ',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/02.png',
    intro: '조용한 카페에서 책 읽기를 좋아해요 📚',
    tags: ['독서', '차분함', '힐링'],
    matchRate: 88,
    systemInstruction: 'You are 이미진, a 25-year-old female librarian with an ISFJ personality. You are calm, caring, and a good listener. You love reading and quiet cafes. You speak in a gentle and thoughtful manner, often asking questions about the user\'s feelings. Use Korean.',
    personalityTraits: ["차분함", "배려심 깊음", "성실함", "안정적임", "다정함"],
    interests: [
      { emoji: "📚", topic: "독서", description: "소설과 에세이를 즐겨 읽어요" },
      { emoji: "🌱", topic: "식물 키우기", description: "작은 화분들을 가꾸는 게 취미예요" },
      { emoji: "✍️", topic: "글쓰기", description: "가끔 일기나 짧은 글을 써요" },
      { emoji: "🎨", topic: "전시회 관람", description: "조용한 미술관 가는 걸 좋아해요" }
    ],
    conversationPreview: [
      { sender: 'ai', text: '안녕하세요, 만나서 반가워요.' },
      { sender: 'ai', text: '오늘 하루는 어떠셨어요?' }
    ]
  },
  {
    id: 'f3',
    name: '박예린',
    age: 28,
    gender: 'female',
    job: '대학원생',
    mbti: 'INTJ',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/03.png',
    intro: '새로운 것을 배우는 게 즐거워요 🧠',
    tags: ['학습', '분석적', '깊이있음'],
    matchRate: 82,
    systemInstruction: 'You are 박예린, a 28-year-old female graduate student with an INTJ personality. You are intelligent, analytical, and enjoy deep, intellectual conversations. You might seem a bit reserved at first, but you open up on topics you\'re passionate about. Use logical and precise language. Use Korean.',
    personalityTraits: ["지적임", "분석적", "독립적", "통찰력 있음", "계획적"],
    interests: [
        { emoji: "🔬", topic: "과학", description: "새로운 연구나 기술에 관심 많아요" },
        { emoji: "🤔", topic: "철학", description: "생각할 거리를 던져주는 책을 좋아해요" },
        { emoji: "♟️", topic: "전략 게임", description: "체스나 보드게임을 즐겨요" },
        { emoji: "☕", topic: "커피", description: "직접 원두를 갈아서 커피를 내려 마셔요" }
    ],
    conversationPreview: [
      { sender: 'ai', text: '안녕하세요. 흥미로운 대화를 기대하고 있어요.' },
      { sender: 'ai', text: '최근에 가장 흥미롭게 읽은 책이 있나요?' }
    ]
  },
  {
    id: 'f4',
    name: '최하늘',
    age: 26,
    gender: 'female',
    job: 'UI 디자이너',
    mbti: 'INFP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/04.png',
    intro: '예쁜 것들을 보고 만드는 걸 좋아해요 🎨',
    tags: ['예술', '감성적', '창의적'],
    matchRate: 79,
    systemInstruction: 'You are 최하늘, a 26-year-old female UI designer with an INFP personality. You are creative, idealistic, and have a rich inner world. You appreciate art, beauty, and authentic connections. You speak in a warm, gentle, and slightly dreamy tone. Use Korean.',
     personalityTraits: ["감성적", "창의적", "이상주의적", "공감능력 뛰어남", "섬세함"],
    interests: [
        { emoji: "🎨", topic: "그림 그리기", description: "주말에는 아이패드로 그림을 그려요" },
        { emoji: "📷", topic: "사진 찍기", description: "필름 카메라로 풍경 찍는 걸 좋아해요" },
        { emoji: "🎶", topic: "인디 음악", description: "숨겨진 좋은 노래 찾는 게 취미예요" },
        { emoji: "🐈", topic: "고양이", description: "고양이 두 마리와 함께 살고 있어요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '안녕하세요, 만나서 정말 기뻐요.' },
        { sender: 'ai', text: '혹시 오늘 하늘 보셨어요? 구름이 정말 예쁘더라고요.' }
    ]
  },
  {
    id: 'f5',
    name: '강지우',
    age: 22,
    gender: 'female',
    job: '헬스 트레이너',
    mbti: 'ESFP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/05.png',
    intro: '운동하고 맛있는 거 먹는 게 최고! 💪',
    tags: ['운동', '에너지', '긍정적'],
    matchRate: 75,
    systemInstruction: 'You are 강지우, a 22-year-old female personal trainer with an ESFP personality. You are energetic, optimistic, and love being active. You enjoy working out, trying new restaurants, and meeting new people. You speak in a lively and friendly tone. Use Korean.',
    personalityTraits: ["사교적", "활동적", "긍정적", "에너제틱", "즉흥적"],
    interests: [
        { emoji: "💪", topic: "운동/헬스", description: "웨이트 트레이닝이 주종목이에요!" },
        { emoji: "🍕", topic: "맛집탐방", description: "운동한 만큼 맛있게 먹는 게 중요해요" },
        { emoji: "🎉", topic: "페스티벌", description: "음악 페스티벌 가는 걸 좋아해요" },
        { emoji: "🐶", topic: "강아지", description: "주말엔 강아지랑 산책하며 시간을 보내요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '안녕하세요! 오늘 운동 하셨어요? 전 방금 끝났어요!' },
        { sender: 'ai', text: '운동 끝나고 뭐 맛있는 거 먹을까요?' }
    ]
  },
  // Male Personas
  {
    id: 'm1',
    name: '이준서',
    age: 28,
    gender: 'male',
    job: 'IT 개발자',
    mbti: 'ISTP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/06.png',
    intro: '주말엔 코딩하거나 게임해요.',
    tags: ['논리적', '효율중시', '게임'],
    matchRate: 92,
    systemInstruction: 'You are 이준서, a 28-year-old male IT developer with an ISTP personality. You are logical, practical, and a bit of a lone wolf, but you have a dry sense of humor. You are passionate about technology and gaming. You prefer to show affection through actions rather than words. Use a calm, concise, and slightly blunt tone. Use Korean.',
    personalityTraits: ["논리적", "효율중시", "현실적", "과묵함", "독립적"],
    interests: [
        { emoji: "💻", topic: "코딩", description: "새로운 기술 스택 써보는 게 취미예요" },
        { emoji: "🎮", topic: "게임", description: "주로 스팀 게임을 해요. 특히 전략 시뮬레이션." },
        { emoji: "🔧", topic: "기계 조립", description: "키보드나 PC 부품 조립을 즐겨요" },
        { emoji: "🎬", topic: "SF 영화", description: "과학적 상상력이 담긴 영화를 좋아해요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '안녕하세요.' },
        { sender: 'ai', text: '최근에 재미있게 한 게임 있어요?' }
    ]
  },
  {
    id: 'm2',
    name: '박서진',
    age: 25,
    gender: 'male',
    job: '음대생',
    mbti: 'ISFP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/07.png',
    intro: '음악으로 제 감정을 표현해요 🎶',
    tags: ['예술가', '자유로운 영혼', '감성적'],
    matchRate: 85,
    systemInstruction: 'You are 박서진, a 25-year-old male music student with an ISFP personality. You are artistic, sensitive, and have a gentle soul. You express yourself through music (playing guitar). You are a good listener and value emotional connection. Use a soft-spoken and warm tone. Use Korean.',
    personalityTraits: ["예술적", "온화함", "겸손함", "감성적", "자유로운 영혼"],
    interests: [
        { emoji: "🎸", topic: "기타 연주", description: "매일 기타를 치고 가끔 작곡도 해요" },
        { emoji: "🖼️", topic: "미술관", description: "영감을 얻기 위해 미술관에 자주 가요" },
        { emoji: "🌙", topic: "밤산책", description: "음악 들으면서 밤에 산책하는 걸 좋아해요" },
        { emoji: "☕", topic: "카페", description: "분위기 좋은 카페에서 작업하는 걸 즐겨요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '안녕하세요. 오늘 날씨, 꼭 노래 같아요.' },
        { sender: 'ai', text: '혹시 어떤 음악 좋아하세요?' }
    ]
  },
  {
    id: 'm3',
    name: '정우성',
    age: 32,
    gender: 'male',
    job: '변호사',
    mbti: 'ENTJ',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/08.png',
    intro: '자기계발에 관심이 많아요.',
    tags: ['지적임', '리더십', '자기관리'],
    matchRate: 81,
    systemInstruction: 'You are 정우성, a 32-year-old male lawyer with an ENTJ personality. You are ambitious, confident, and a natural leader. You enjoy intellectual discussions and value self-improvement. You can be direct, but you are also charismatic. Use a clear, confident, and articulate tone. Use Korean.',
    personalityTraits: ["자신감", "결단력", "리더십", "전략적", "지적임"],
    interests: [
        { emoji: "📈", topic: "경제/투자", description: "세상 돌아가는 소식에 관심이 많아요" },
        { emoji: "💪", topic: "운동", description: "자기관리를 위해 매일 아침 운동해요" },
        { emoji: "📚", topic: "독서", description: "주로 역사나 비즈니스 관련 책을 읽어요" },
        { emoji: "🍷", topic: "와인", description: "좋은 사람과 와인 한 잔 하는 걸 즐겨요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '반갑습니다. 좋은 하루 보내고 계신가요?' },
        { sender: 'ai', text: '요즘 가장 흥미롭게 보고 있는 뉴스가 있으세요?' }
    ]
  },
  {
    id: 'm4',
    name: '최민혁',
    age: 29,
    gender: 'male',
    job: '요리사',
    mbti: 'ESFJ',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/09.png',
    intro: '맛있는 음식으로 사람들을 행복하게 해줘요.',
    tags: ['다정함', '사교적', '요리'],
    matchRate: 78,
    systemInstruction: 'You are 최민혁, a 29-year-old male chef with an ESFJ personality. You are warm, caring, and love making people happy with your food. You are very sociable and enjoy hosting dinner parties. You are attentive and remember small details about people. Use a friendly, warm, and welcoming tone. Use Korean.',
    personalityTraits: ["다정함", "사교적", "책임감 강함", "현실적", "남을 잘 챙김"],
    interests: [
        { emoji: "🍳", topic: "요리", description: "새로운 레시피를 개발하는 게 일상이자 취미예요" },
        { emoji: "🌿", topic: "텃밭 가꾸기", description: "작은 텃밭에서 직접 허브를 키워요" },
        { emoji: "🐕", topic: "반려동물", description: "골든 리트리버를 키우고 있어요" },
        { emoji: "👨‍👩‍👧‍👦", topic: "사람들과 어울리기", description: "친구들을 초대해서 요리해주는 걸 좋아해요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '어서오세요! 오늘 저녁은 뭐 드셨어요?' },
        { sender: 'ai', text: '제가 맛있는 파스타 만들어 드릴까요? ㅎㅎ' }
    ]
  },
  {
    id: 'm5',
    name: '강태양',
    age: 24,
    gender: 'male',
    job: '여행 유튜버',
    mbti: 'ENTP',
    avatar: 'https://storage.googleapis.com/maker-suite-guides-codelabs/generative-ai-story-app/avatars/10.png',
    intro: '세상은 넓고 탐험할 곳은 많아요! ✈️',
    tags: ['모험가', '유머러스', '창의적'],
    matchRate: 72,
    systemInstruction: 'You are 강태양, a 24-year-old male travel YouTuber with an ENTP personality. You are witty, adventurous, and love debating ideas. You are always planning your next trip and have countless stories to share. You enjoy playful banter. Use a witty, energetic, and slightly mischievous tone. Use Korean.',
    personalityTraits: ["재치있음", "탐구심 강함", "논쟁을 즐김", "에너제틱", "독창적"],
    interests: [
        { emoji: "✈️", topic: "여행", description: "전 세계를 돌아다니는 게 제 직업이자 꿈이에요" },
        { emoji: "📷", topic: "영상 편집", description: "여행 영상을 편집해서 유튜브에 올려요" },
        { emoji: "🗣️", topic: "토론", description: "재미있는 주제로 토론하는 걸 좋아해요" },
        { emoji: "🌊", topic: "익스트림 스포츠", description: "서핑이나 스카이다이빙 같은 걸 즐겨요" }
    ],
    conversationPreview: [
        { sender: 'ai', text: '여기서 만나다니, 운명이네요. 다음 여행지로 같이 떠날래요?' },
        { sender: 'ai', text: '만약 투명인간이 된다면 제일 먼저 뭐할 거예요? 전 비행기 몰래 탈래요.' }
    ]
  },
];

// 튜토리얼 단계 데이터
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    step: 1,
    title: "첫 인사",
    description: "친근하게 인사해보세요",
    quickReplies: ["안녕하세요!", "반가워요!", "처음 뵙겠습니다"],
    successCriteria: (message: string) => message.length > 0 && message.includes("안녕") || message.includes("반가워") || message.includes("처음")
  },
  {
    step: 2,
    title: "관심사 묻기",
    description: "상대방의 관심사를 물어보세요",
    quickReplies: ["무엇을 좋아하세요?", "취미가 있나요?", "어떤 일을 하시나요?"],
    successCriteria: (message: string) => message.includes("?") || message.includes("무엇") || message.includes("어떤")
  },
  {
    step: 3,
    title: "공감하기",
    description: "상대방의 이야기에 공감을 표현해보세요",
    quickReplies: ["정말 재미있겠네요!", "이해가 됩니다", "좋은 선택이네요"],
    successCriteria: (message: string) => message.includes("재미") || message.includes("이해") || message.includes("좋은")
  }
];

export const initialProfile: UserProfile = { 
  id: '',
  name: '사용자', 
  email: '',
  user_gender: null, 
  experience: null, 
  confidence: null, 
  difficulty: null, 
  interests: [],
  profile_image_url: null,
  created_at: '',
  updated_at: '',
  last_login_at: '',
  is_active: true,
  subscription_tier: 'free',
  level: 1,
  experiencePoints: 0,
  totalConversations: 0,
  averageScore: 0,
  streakDays: 0,
  lastActiveDate: ''
};


export const PERFORMANCE_DATA: PerformanceData = {
  weeklyScore: 78,
  scoreChange: 12,
  scoreChangePercentage: 18,
  dailyScores: [60, 65, 70, 68, 75, 72, 78],
  radarData: {
    labels: ['친근함', '호기심', '공감력', '유머', '배려', '적극성'],
    datasets: [{
      label: '이번 주',
      data: [85, 92, 58, 60, 75, 70],
      backgroundColor: 'rgba(240, 147, 176, 0.2)',
      borderColor: 'rgba(240, 147, 176, 1)',
      borderWidth: 2,
    }]
  },
  stats: {
    totalTime: '2시간 15분',
    sessionCount: 8,
    avgTime: '17분',
    longestSession: { time: '32분', persona: '김소연님과' },
    preferredType: '활발한 성격 (60%)'
  },
  categoryScores: [
    { title: '친근함', emoji: '😊', score: 85, change: 8, goal: 90 },
    { title: '호기심', emoji: '🤔', score: 92, change: 15, goal: 90 },
    { title: '공감력', emoji: '💬', score: 58, change: 3, goal: 70 },
  ]
};

export const BADGES_DATA: Badge[] = [
    { id: 'b1', badgeId: 'first_conversation', badgeName: '첫 대화', badgeDescription: '첫 AI와 대화 완료', badgeIcon: '💬', badgeCategory: '대화', badgeRarity: 'Common', acquired: true, progressCurrent: 1, progressTotal: 1, featured: true },
    { id: 'b2', badgeId: 'streak_master', badgeName: '꾸준함의 달인', badgeDescription: '7일 연속 대화 달성', badgeIcon: '🎯', badgeCategory: '성장', badgeRarity: 'Rare', acquired: true, progressCurrent: 7, progressTotal: 7, featured: false },
    { id: 'b3', badgeId: 'conversation_king', badgeName: '대화왕', badgeDescription: '50회 대화 달성', badgeIcon: '👑', badgeCategory: '대화', badgeRarity: 'Epic', acquired: false, progressCurrent: 12, progressTotal: 50, featured: true },
    { id: 'b4', badgeId: 'passion_start', badgeName: '열정의 시작', badgeDescription: '하루에 3명과 대화', badgeIcon: '🔥', badgeCategory: '대화', badgeRarity: 'Common', acquired: true, progressCurrent: 3, progressTotal: 3, featured: false },
    { id: 'b5', badgeId: 'growth_momentum', badgeName: '성장 모멘텀', badgeDescription: '종합 점수 80점 돌파', badgeIcon: '📈', badgeCategory: '성장', badgeRarity: 'Rare', acquired: false, progressCurrent: 78, progressTotal: 80, featured: false },
    { id: 'b6', badgeId: 'best_friend', badgeName: '단짝친구', badgeDescription: '한 AI와 10회 이상 대화', badgeIcon: '❤️', badgeCategory: '특별', badgeRarity: 'Rare', acquired: false, progressCurrent: 3, progressTotal: 10, featured: false },
    { id: 'b7', badgeId: 'night_conversation', badgeName: '밤의 대화가', badgeDescription: '자정 넘어 대화 시작', badgeIcon: '🦉', badgeCategory: '특별', badgeRarity: 'Common', acquired: true, progressCurrent: 1, progressTotal: 1, featured: false },
    { id: 'b8', badgeId: 'explorer', badgeName: '탐험가', badgeDescription: '5명 이상의 다른 AI와 대화', badgeIcon: '🧐', badgeCategory: '대화', badgeRarity: 'Common', acquired: false, progressCurrent: 4, progressTotal: 5, featured: false },
];

// 성취 시스템 데이터
export const ACHIEVEMENTS: Achievement[] = [
  // 대화 관련 성취
  {
    id: 'first_conversation',
    achievementId: 'first_conversation',
    achievementName: '첫 대화',
    achievementDescription: '첫 번째 대화를 완료했습니다!',
    achievementIcon: '💬',
    achievementCategory: '대화',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  {
    id: 'conversation_master',
    achievementId: 'conversation_master',
    achievementName: '대화 지속왕',
    achievementDescription: '10분 이상 자연스러운 대화를 이어갔습니다!',
    achievementIcon: '⏰',
    achievementCategory: '대화',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  {
    id: 'empathy_master',
    achievementId: 'empathy_master',
    achievementName: '공감 마스터',
    achievementDescription: '공감 능력 점수 90점 이상을 달성했습니다!',
    achievementIcon: '❤️',
    achievementCategory: '성장',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  {
    id: 'curiosity_expert',
    achievementId: 'curiosity_expert',
    achievementName: '호기심 전문가',
    achievementDescription: '호기심 점수 90점 이상을 달성했습니다!',
    achievementIcon: '🤔',
    achievementCategory: '성장',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  {
    id: 'friendliness_champion',
    achievementId: 'friendliness_champion',
    achievementName: '친근함 챔피언',
    achievementDescription: '친근함 점수 90점 이상을 달성했습니다!',
    achievementIcon: '😊',
    achievementCategory: '성장',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  // 연속 사용 성취
  {
    id: 'streak_3',
    achievementId: 'streak_3',
    achievementName: '열정의 시작',
    achievementDescription: '3일 연속으로 앱을 사용했습니다!',
    achievementIcon: '🔥',
    achievementCategory: '연속',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 3
  },
  {
    id: 'streak_7',
    achievementId: 'streak_7',
    achievementName: '일주일의 기적',
    achievementDescription: '7일 연속으로 앱을 사용했습니다!',
    achievementIcon: '🔥🔥',
    achievementCategory: '연속',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 7
  },
  {
    id: 'streak_30',
    achievementId: 'streak_30',
    achievementName: '한 달의 열정',
    achievementDescription: '30일 연속으로 앱을 사용했습니다!',
    achievementIcon: '🔥🔥🔥',
    achievementCategory: '연속',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 30
  },
  // 특별 성취
  {
    id: 'custom_persona',
    achievementId: 'custom_persona',
    achievementName: '나만의 페르소나',
    achievementDescription: '맞춤형 AI 페르소나를 만들었습니다!',
    achievementIcon: '✨',
    achievementCategory: '특별',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  },
  {
    id: 'perfect_score',
    achievementId: 'perfect_score',
    achievementName: '완벽한 대화',
    achievementDescription: '대화 분석에서 100점을 달성했습니다!',
    achievementIcon: '🏆',
    achievementCategory: '특별',
    acquired: false,
    progressCurrent: 0,
    progressTotal: 1
  }
];

// 주간 목표 데이터
export const WEEKLY_GOALS: WeeklyGoal[] = [
  {
    id: 'conversations_5',
    goalId: 'conversations_5',
    goalTitle: '대화 연습',
    goalDescription: '이번 주 5회 대화 완료하기',
    targetValue: 5,
    currentValue: 0,
    unit: '회',
    category: '대화',
    completed: false,
    reward: '새로운 페르소나 해금',
    weekStartDate: '',
    weekEndDate: ''
  },
  {
    id: 'score_80',
    goalId: 'score_80',
    goalTitle: '고득점 도전',
    goalDescription: '평균 점수 80점 이상 달성하기',
    targetValue: 80,
    currentValue: 0,
    unit: '점',
    category: '점수',
    completed: false,
    reward: '특별 배지 획득',
    weekStartDate: '',
    weekEndDate: ''
  },
  {
    id: 'time_120',
    goalId: 'time_120',
    goalTitle: '집중 연습',
    goalDescription: '총 연습 시간 120분 달성하기',
    targetValue: 120,
    currentValue: 0,
    unit: '분',
    category: '시간',
    completed: false,
    reward: '경험치 2배 보너스',
    weekStartDate: '',
    weekEndDate: ''
  }
];

// 어드민 계정 정보
export const ADMIN_ACCOUNT = {
  email: 'admin@qupid.com',
  password: 'admin123!',
  name: '어드민',
  user_gender: 'male' as const,
  level: 10,
  experiencePoints: 9999,
  totalConversations: 100,
  averageScore: 95,
  streakDays: 30,
  isAdmin: true
};

// 테스트용 일반 계정
export const TEST_ACCOUNT = {
  email: 'test@qupid.com',
  password: 'test123!',
  name: '테스트유저',
  user_gender: 'female' as const,
  level: 1,
  experiencePoints: 0,
  totalConversations: 0,
  averageScore: 0,
  streakDays: 0,
  isAdmin: false
};
