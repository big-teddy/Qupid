import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, SparklesIcon } from "@qupid/ui";
import { useGeneratePersona } from "../../../shared/hooks/usePersonaGeneration";
import { useUserStore } from "../../../shared/stores/userStore";
import { useUserProfile } from "../../../shared/hooks/api/useUser";
import { getRandomAvatar } from "../../../shared/utils/avatarGenerator";
import Logger from "../../../shared/utils/logger";
// 🚀 카테고리별 페르소나 속성 정의
const PERSONA_ATTRIBUTES = {
    dating: {
        title: "연애 연습용 AI",
        description: "연애 상황에서의 대화를 연습해보세요",
        personalities: [
            {
                id: "romantic",
                name: "로맨틱한",
                description: "달콤하고 로맨틱한 대화를 좋아해요",
            },
            {
                id: "cheerful",
                name: "발랄한",
                description: "에너지가 넘치고 장난기가 많아요",
            },
            {
                id: "calm",
                name: "차분한",
                description: "진지하고 깊은 대화를 선호해요",
            },
            {
                id: "tsundere",
                name: "츤데레",
                description: "겉으론 차갑지만 속은 따뜻해요",
            },
        ],
        ages: [
            { id: "20s", name: "20대", description: "대학생/사회초년생 느낌" },
            { id: "30s", name: "30대", description: "성숙하고 안정적인 느낌" },
            { id: "40s", name: "40대", description: "여유롭고 경험이 풍부한 느낌" },
        ],
        jobs: [
            { id: "student", name: "대학생", description: "캠퍼스 라이프" },
            { id: "office", name: "직장인", description: "오피스 라이프" },
            { id: "freelancer", name: "프리랜서", description: "자유로운 영혼" },
            { id: "artist", name: "예술가", description: "감성적인 영혼" },
        ],
        hobbies: [
            { id: "travel", name: "여행", description: "새로운 곳 탐험하기" },
            { id: "movie", name: "영화/드라마", description: "함께 콘텐츠 즐기기" },
            { id: "exercise", name: "운동", description: "건강한 라이프스타일" },
            { id: "reading", name: "독서", description: "지적인 대화 나누기" },
        ],
    },
    work: {
        title: "면접/비즈니스 AI",
        description: "면접 준비나 비즈니스 상황을 시뮬레이션하세요",
        personalities: [
            {
                id: "strict",
                name: "엄격한 면접관",
                description: "날카로운 질문으로 압박 면접 진행",
            },
            {
                id: "supportive",
                name: "친절한 사수",
                description: "업무 팁을 알려주고 격려해줘요",
            },
            {
                id: "negotiator",
                name: "까다로운 거래처",
                description: "협상 능력을 테스트해보세요",
            },
            {
                id: "mentor",
                name: "지혜로운 멘토",
                description: "커리어 고민을 상담해줘요",
            },
        ],
        ages: [
            { id: "30s", name: "30대 실무자", description: "현직자의 생생한 조언" },
            { id: "40s", name: "40대 관리자", description: "리더십과 관리 노하우" },
            { id: "50s", name: "50대 임원", description: "경영진 시각의 인사이트" },
        ],
        jobs: [
            { id: "hr", name: "인사팀장", description: "채용 및 인사 평가" },
            { id: "developer", name: "개발 팀장", description: "기술 면접 및 코드 리뷰" },
            { id: "sales", name: "영업 이사", description: "비즈니스 협상 및 세일즈" },
            { id: "marketing", name: "마케터", description: "브랜딩 및 전략 수립" },
        ],
        hobbies: [
            { id: "startup", name: "스타트업", description: "창업 및 비즈니스 트렌드" },
            {
                id: "leadership",
                name: "리더십",
                description: "조직 관리 및 팀빌딩",
            },
            {
                id: "tech",
                name: "신기술",
                description: "AI, 블록체인 등 최신 기술",
            },
            {
                id: "finance",
                name: "재테크",
                description: "주식, 부동산 등 자산 관리",
            },
        ],
    },
    hobby: {
        title: "취미 공유 AI",
        description: "관심사를 공유할 수 있는 AI 친구를 만들어보세요",
        personalities: [
            {
                id: "passionate",
                name: "열정적인 덕후",
                description: "같은 취미를 깊이 있게 파고들어요",
            },
            {
                id: "teacher",
                name: "친절한 선생님",
                description: "초보자에게 알기 쉽게 설명해줘요",
            },
            {
                id: "critic",
                name: "냉철한 평론가",
                description: "작품이나 대상을 깊이 있게 분석해요",
            },
            {
                id: "partner",
                name: "함께하는 파트너",
                description: "같이 배우고 성장하는 친구",
            },
        ],
        ages: [
            { id: "20s", name: "20대 친구", description: "트렌디한 감각 공유" },
            { id: "30s", name: "30대 동호회원", description: "진지한 취미 생활" },
            { id: "expert", name: "분야 전문가", description: "오랜 경력의 노하우" },
        ],
        jobs: [
            { id: "expert", name: "전문가", description: "해당 분야의 프로" },
            { id: "enthusiast", name: "매니아", description: "순수한 열정의 소유자" },
            { id: "instructor", name: "강사", description: "가르치는 것이 직업" },
            { id: "creator", name: "크리에이터", description: "콘텐츠를 만드는 사람" },
        ],
        hobbies: [
            { id: "game", name: "게임", description: "롤, 배그, 콘솔 게임 등" },
            { id: "cooking", name: "요리", description: "맛집 탐방 및 레시피 공유" },
            { id: "music", name: "음악", description: "악기 연주, 작곡, 감상" },
            {
                id: "art",
                name: "미술/디자인",
                description: "그림 그리기, 전시회 관람",
            },
        ],
    },
    custom: {
        // custom 카테고리는 별도 UI로 처리될 수 있음
        title: "자유 주제",
        description: "나만의 특별한 AI 친구를 만들어보세요",
        personalities: [],
        ages: [],
        jobs: [],
        hobbies: [],
    },
};
export const CustomPersonaForm = ({ onCreate, onBack, onCancel, category = "dating", }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const generatePersona = useGeneratePersona();
    const { user } = useUserStore();
    const { data: userProfile } = useUserProfile(user?.id || "");
    const [step, setStep] = useState(1);
    const [description, setDescription] = useState("");
    const [selectedPersonality, setSelectedPersonality] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    const [selectedHobby, setSelectedHobby] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const currentCategory = PERSONA_ATTRIBUTES[category];
    const handleCreate = async () => {
        if (!description && category === "custom")
            return;
        setIsGenerating(true);
        // 🚀 실제 API 연동 또는 목업 데이터 생성
        // 여기서는 generatePersona.mutateAsync를 호출하거나, 선택된 속성을 조합하여 Persona 객체를 생성
        try {
            if (category === "custom") {
                // 커스텀 입력인 경우 API 호출
                const result = await generatePersona.mutateAsync({
                    userGender: userProfile?.user_gender || "male",
                    userInterests: [description],
                    isTutorial: false,
                });
                // Map the result to Persona type
                const persona = {
                    id: result.id,
                    name: result.name,
                    age: result.age,
                    gender: result.gender,
                    avatar: result.avatar,
                    job: result.occupation || "알 수 없음",
                    mbti: result.personality || "ENFP",
                    intro: result.conversationStyle || `${result.name}입니다. 반가워요!`,
                    tags: result.interests.slice(0, 3) || [],
                    match_rate: 85,
                    system_instruction: `당신은 ${result.name}입니다. 자연스럽고 친근한 대화를 나누세요.`,
                    personality_traits: result.values?.slice(0, 3) || [],
                    interests: result.interests.slice(0, 3).map((topic) => ({
                        emoji: "✨",
                        topic,
                        description: `${topic}에 관심이 있어요`,
                    })) || [],
                    conversation_preview: [{ sender: "ai", text: "안녕하세요! 반가워요 😊" }],
                };
                Logger.info("✅ 커스텀 페르소나 생성 성공:", persona);
                onCreate?.(persona);
            }
            else {
                // 카테고리 선택인 경우 API 호출하여 더 정교한 페르소나 생성하도록 변경
                // 선택된 속성들을 조합하여 프롬프트 구성
                const personality = currentCategory.personalities.find((p) => p.id === selectedPersonality);
                const age = currentCategory.ages.find((a) => a.id === selectedAge);
                const job = currentCategory.jobs.find((j) => j.id === selectedJob);
                const hobby = currentCategory.hobbies.find((h) => h.id === selectedHobby);
                const prompt = `${category} 상황을 위한 AI 친구를 만들어줘. 
                    성격: ${personality?.name || selectedPersonality}, 
                    나이대: ${age?.name || selectedAge}, 
                    직업: ${job?.name || selectedJob}, 
                    관심사: ${hobby?.name || selectedHobby}.`;
                const result = await generatePersona.mutateAsync({
                    userGender: userProfile?.user_gender || "male",
                    userInterests: [prompt],
                    isTutorial: false,
                });
                // Map the result to Persona type with overrides from selection
                const persona = {
                    id: result.id,
                    name: result.name,
                    age: result.age,
                    gender: result.gender,
                    avatar: result.avatar,
                    job: result.occupation || job?.name || "알 수 없음",
                    mbti: result.personality || "ENFP",
                    intro: result.conversationStyle || `${result.name}입니다. ${hobby?.name}에 대해 이야기 나누고 싶어요.`,
                    tags: [category, personality?.name || "", hobby?.name || ""].filter(Boolean),
                    match_rate: 90,
                    system_instruction: `당신은 ${result.name}입니다. ${category} 상황에 맞춰 대화하세요. 성격: ${personality?.name}, 직업: ${job?.name}, 관심사: ${hobby?.name}`,
                    personality_traits: [personality?.name || "", "친근함", "센스있는"].filter(Boolean),
                    interests: [hobby?.name].filter(Boolean).map((topic) => ({
                        emoji: "✨",
                        topic: topic || "취미",
                        description: `${topic}를 좋아해요`,
                    })),
                    conversation_preview: [{ sender: "ai", text: `안녕하세요! ${hobby?.name} 좋아하시나요? 😊` }],
                };
                Logger.info("✅ 카테고리별 페르소나 생성 성공:", persona);
                // 생성된 페르소나를 부모 컴포넌트로 전달
                onCreate?.(persona);
            }
        }
        catch (error) {
            Logger.error("❌ 페르소나 생성 실패:", error);
            // 실패 시 선택된 속성으로 기본 페르소나 생성
            const partnerGender = userProfile?.user_gender === "male" ? "female" : "male";
            const personality = currentCategory.personalities.find((p) => p.id === selectedPersonality);
            const age = currentCategory.ages.find((a) => a.id === selectedAge);
            const job = currentCategory.jobs.find((j) => j.id === selectedJob);
            const hobby = currentCategory.hobbies.find((h) => h.id === selectedHobby);
            const fallbackPersona = {
                id: `custom-persona-${Date.now()}`,
                name: partnerGender === "female" ? "이서영" : "최민수",
                age: selectedAge === "20s" ? 26 : selectedAge === "30s" ? 32 : 38,
                gender: partnerGender,
                job: job?.name || "디자이너",
                mbti: "ENFP",
                intro: "안녕하세요! 만나서 반가워요.",
                system_instruction: "친절하고 자연스럽게 대화하세요.",
                tags: ["기본", "fallback"],
                personality_traits: [personality?.name || "친근한"],
                interests: [
                    {
                        emoji: "✨",
                        topic: hobby?.name || "여행",
                        description: "함께 이야기해요"
                    }
                ],
                avatar: getRandomAvatar(partnerGender),
                match_rate: 85,
                conversation_preview: [
                    {
                        sender: "ai",
                        text: `안녕하세요! ${personality?.description} ${hobby?.name}에 대해 이야기해보고 싶어요 😊`,
                    },
                ],
            };
            onCreate?.(fallbackPersona);
        }
        finally {
            setIsGenerating(false);
        }
    };
    const renderAttributeSelector = (title, items, selectedValue, onSelect) => (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-[#191F28] mb-3", children: title }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: items.map((item) => (_jsxs("button", { onClick: () => onSelect(item.id), className: `p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${selectedValue === item.id
                        ? "border-[#F093B0] bg-[#FFF0F5]"
                        : "border-gray-100 bg-white hover:border-[#F093B0]/30"}`, children: [_jsx("div", { className: "font-bold text-[#191F28] mb-1", children: item.name }), _jsx("div", { className: "text-xs text-gray-500", children: item.description }), selectedValue === item.id && (_jsx("div", { className: "absolute top-2 right-2 text-[#F093B0]", children: _jsx(SparklesIcon, { className: "w-5 h-5" }) }))] }, item.id))) })] }));
    return (_jsxs("div", { className: "flex flex-col h-full bg-white", children: [_jsxs("div", { className: "flex items-center p-4 border-b border-gray-100", children: [_jsx("button", { onClick: onBack, className: "p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(ArrowLeftIcon, { className: "w-6 h-6 text-[#191F28]" }) }), _jsx("h1", { className: "text-lg font-bold text-[#191F28] ml-2", children: category === "custom" ? "커스텀 페르소나" : currentCategory.title })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6 pb-24", children: category === "custom" ? (_jsxs("div", { children: [_jsxs("div", { className: "mb-8 p-6 bg-[#FFF0F5] rounded-2xl", children: [_jsx("h2", { className: "text-xl font-bold text-[#191F28] mb-2", children: "\uB098\uB9CC\uC758 AI \uCE5C\uAD6C \uB9CC\uB4E4\uAE30 \uD83C\uDFA8" }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: "\uC5B4\uB5A4 \uCE5C\uAD6C\uB97C \uC6D0\uD558\uC2DC\uB098\uC694? \uC131\uACA9, \uC9C1\uC5C5, \uCDE8\uBBF8 \uB4F1 \uC790\uC720\uB86D\uAC8C \uC124\uBA85\uD574\uC8FC\uC138\uC694. Qupid\uAC00 \uB531 \uB9DE\uB294 \uCE5C\uAD6C\uB97C \uCC3E\uC544\uB4DC\uB9B4\uAC8C\uC694!" })] }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "\uC608: 20\uB300 \uD6C4\uBC18\uC758 \uCE74\uD398 \uC0AC\uC7A5\uB2D8\uC778\uB370, \uCEE4\uD53C\uB791 \uC7AC\uC988\uB97C \uC5C4\uCCAD \uC88B\uC544\uD574. \uC131\uACA9\uC740 \uCC28\uBD84\uD558\uC9C0\uB9CC \uAC00\uB054 \uC5C9\uB6B1\uD55C \uB9E4\uB825\uC774 \uC788\uC73C\uBA74 \uC88B\uACA0\uC5B4.", className: "w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-[#F093B0] focus:ring-2 focus:ring-[#F093B0]/20 resize-none text-base transition-all placeholder:text-gray-400" })] })) : (_jsxs("div", { className: "animate-fade-in", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-[#191F28] mb-2", children: currentCategory.title }), _jsx("p", { className: "text-gray-600", children: currentCategory.description })] }), renderAttributeSelector("성격은 어땠으면 좋겠나요?", currentCategory.personalities, selectedPersonality, setSelectedPersonality), renderAttributeSelector("나이대는요?", currentCategory.ages, selectedAge, setSelectedAge), renderAttributeSelector("직업은 무엇일까요?", currentCategory.jobs, selectedJob, setSelectedJob), renderAttributeSelector("어떤 관심사를 공유할까요?", currentCategory.hobbies, selectedHobby, setSelectedHobby)] })) }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100", children: _jsx("button", { onClick: handleCreate, disabled: isGenerating ||
                        (category === "custom"
                            ? !description
                            : !selectedPersonality ||
                                !selectedAge ||
                                !selectedJob ||
                                !selectedHobby), className: `w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isGenerating ||
                        (category === "custom"
                            ? !description
                            : !selectedPersonality ||
                                !selectedAge ||
                                !selectedJob ||
                                !selectedHobby)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#F093B0] text-white hover:bg-[#E082A0] shadow-lg shadow-[#F093B0]/30"}`, children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(SparklesIcon, { className: "w-5 h-5 animate-spin" }), "\uD398\uB974\uC18C\uB098 \uC0DD\uC131 \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsx(SparklesIcon, { className: "w-5 h-5" }), "AI \uCE5C\uAD6C \uC0DD\uC131\uD558\uAE30"] })) }) })] }));
};
export default CustomPersonaForm;
