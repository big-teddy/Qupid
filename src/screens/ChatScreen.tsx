
import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Persona, Message, RealtimeFeedback, TutorialStep } from '../types/index';
import { createChatSession, sendMessageToAI, analyzeConversation, getRealtimeFeedback } from '../services/geminiService';
import { ArrowLeftIcon, PaperAirplaneIcon, LightbulbIcon, ThumbUpIcon, HelpCircleIcon } from '../components/Icons';
import { Chat } from '@google/genai';
import { TUTORIAL_STEPS } from '../constants/index';

interface ChatScreenProps {
  persona: Persona;
  isTutorial: boolean;
  onComplete: (analysis: any) => void;
  onBack: () => void;
}

interface ConversationScore {
  total: number;
  friendliness: number;
  curiosity: number;
  empathy: number;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center justify-center space-x-1">
    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{backgroundColor: 'var(--text-tertiary)'}}></div>
    <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{backgroundColor: 'var(--text-tertiary)'}}></div>
    <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: 'var(--text-tertiary)'}}></div>
  </div>
);

const RealtimeFeedbackToast: React.FC<{ feedback: RealtimeFeedback }> = ({ feedback }) => (
    <div className="absolute bottom-24 right-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center animate-fade-in-up shadow-lg z-10">
        {feedback.isGood ? <ThumbUpIcon className="w-5 h-5 mr-2 text-green-400" /> : <LightbulbIcon className="w-5 h-5 mr-2 text-yellow-400" />}
        <span className="text-sm font-medium">{feedback.message}</span>
    </div>
);

const ScoreTracker: React.FC<{ score: ConversationScore; isVisible: boolean }> = ({ score, isVisible }) => (
  <div className={`absolute top-20 right-4 bg-white border border-gray-200 rounded-xl p-3 shadow-lg transition-all duration-300 z-10 ${
    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
  }`}>
    <div className="text-center mb-2">
      <div className="text-xl font-bold text-pink-500">{score.total}점</div>
      <div className="text-xs text-gray-600">/100점</div>
    </div>
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span>😊 친근함</span>
        <div className="flex items-center">
          <div className="w-12 h-1 bg-gray-200 rounded-full mr-2">
            <div className="h-1 bg-green-500 rounded-full" style={{ width: `${score.friendliness}%` }}></div>
          </div>
          <span className="text-xs">{score.friendliness}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span>🤔 호기심</span>
        <div className="flex items-center">
          <div className="w-12 h-1 bg-gray-200 rounded-full mr-2">
            <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${score.curiosity}%` }}></div>
          </div>
          <span className="text-xs">{score.curiosity}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span>💬 공감력</span>
        <div className="flex items-center">
          <div className="w-12 h-1 bg-gray-200 rounded-full mr-2">
            <div className="h-1 bg-purple-500 rounded-full" style={{ width: `${score.empathy}%` }}></div>
          </div>
          <span className="text-xs">{score.empathy}%</span>
        </div>
      </div>
    </div>
  </div>
);

const SmartHintCard: React.FC<{ 
  hint: string; 
  suggestions: string[]; 
  onApply: (text: string) => void; 
  onClose: () => void;
  isVisible: boolean;
}> = ({ hint, suggestions, onApply, onClose, isVisible }) => (
  <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 transition-all duration-300 ${
    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}>
    <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border-2 border-pink-300">
      <div className="flex items-center mb-4">
        <LightbulbIcon className="w-6 h-6 text-pink-500 mr-2" />
        <h3 className="font-bold text-gray-800">코치 제안</h3>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
          <span className="text-xl">×</span>
        </button>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">{hint}</p>
      
      <div className="space-y-2 mb-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onApply(suggestion)}
            className="w-full text-left p-3 bg-pink-50 border border-pink-200 rounded-lg text-sm text-pink-700 hover:bg-pink-100 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          직접 입력
        </button>
        <button
          onClick={() => onApply(suggestions[0])}
          className="flex-1 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
        >
          적용하기
        </button>
      </div>
    </div>
  </div>
);

const ChatScreen: React.FC<ChatScreenProps> = ({ persona, isTutorial, onComplete, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedback | null>(null);
  const [conversationScore, setConversationScore] = useState<ConversationScore>({
    total: 65,
    friendliness: 70,
    curiosity: 80,
    empathy: 60
  });
  
  const [isTutorialMode, setIsTutorialMode] = useState(isTutorial);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(TUTORIAL_STEPS[0]);
  const [showScoreTracker, setShowScoreTracker] = useState(false);
  const [showSmartHint, setShowSmartHint] = useState(false);
  const [smartHint, setSmartHint] = useState({ hint: '', suggestions: [] as string[] });
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const hintTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const systemInstruction = persona.systemInstruction || persona.intro || `당신은 ${persona.name}입니다. ${persona.intro}`;
    chatSessionRef.current = createChatSession(systemInstruction);
    setIsTutorialMode(isTutorial);
    setTutorialStep(TUTORIAL_STEPS[0]);

    const initialMessages: Message[] = isTutorial 
      ? [{ sender: 'system', text: `${persona.name}님과의 첫 만남이에요. 튜토리얼에 따라 대화를 시작해보세요 😊` }]
      : [];
      
    setMessages([...initialMessages, ...persona.conversationPreview]);
  }, [persona, isTutorial]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (realtimeFeedback) {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = window.setTimeout(() => setRealtimeFeedback(null), 2500);
    }
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    }
  }, [realtimeFeedback]);

  // Smart hint system - show hint after 3 seconds of silence
  useEffect(() => {
    if (messages.length > 0 && !isLoading && !isTutorialMode) {
      const timeSinceLastMessage = Date.now() - lastMessageTime;
      if (timeSinceLastMessage > 3000 && !showSmartHint) {
        generateSmartHint();
      }
    }
  }, [lastMessageTime, messages, isLoading, isTutorialMode, showSmartHint]);

  const generateSmartHint = () => {
    const lastAiMessage = messages.filter(m => m.sender === 'ai').pop()?.text || '';
    const userMessageCount = messages.filter(m => m.sender === 'user').length;
    
    let hint = '';
    let suggestions: string[] = [];
    
    if (userMessageCount === 0) {
      hint = '자연스러운 인사로 대화를 시작해보세요!';
      suggestions = ['안녕하세요!', '반갑습니다 😊', '처음 뵙겠습니다'];
    } else if (lastAiMessage.includes('게임')) {
      hint = '게임에 대한 관심을 보여주고 있네요. 더 구체적으로 물어보는 건 어떨까요?';
      suggestions = ['어떤 게임을 좋아하세요?', '최근에 재미있게 플레이한 게임이 있나요?', '게임할 때 어떤 장르를 선호하세요?'];
    } else if (lastAiMessage.includes('영화')) {
      hint = '영화 이야기가 나왔네요. 상대방의 취향을 더 자세히 알아보세요!';
      suggestions = ['어떤 장르의 영화를 좋아하세요?', '최근에 본 영화 중 인상 깊었던 작품이 있나요?', '영화관에서 보는 걸 선호하시나요?'];
    } else {
      hint = '상대방의 이야기에 더 관심을 보이고, 자연스럽게 질문을 이어가보세요!';
      suggestions = ['정말요?', '어떻게 그렇게 되었나요?', '그때 어떤 기분이었어요?'];
    }
    
    setSmartHint({ hint, suggestions });
    setShowSmartHint(true);
  };

  const handleSend = useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isLoading || isAnalyzing || !chatSessionRef.current) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastMessageTime(Date.now());
    setShowSmartHint(false);

    try {
      const lastAiMessage = messages.filter(m => m.sender === 'ai').pop()?.text;
      const feedback = await getRealtimeFeedback(messageText, lastAiMessage);
      setRealtimeFeedback(feedback);

      const aiResponse = await sendMessageToAI(chatSessionRef.current, messageText);
      
      if (aiResponse) {
        const aiMessage: Message = { sender: 'ai', text: aiResponse };
        setMessages(prev => [...prev, aiMessage]);
        
        // 튜토리얼 모드에서 다음 단계로 진행
        if (isTutorialMode && tutorialStep) {
          const currentStepIndex = TUTORIAL_STEPS.findIndex(step => step.step === tutorialStep.step);
          if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
            setTutorialStep(TUTORIAL_STEPS[currentStepIndex + 1]);
          }
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = { 
        sender: 'ai', 
        text: '죄송해요, 지금은 답변하기 어렵네요. 잠시 후 다시 시도해주세요.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, isAnalyzing, isTutorialMode, tutorialStep]);

  const handleComplete = useCallback(async () => {
    if (messages.filter(m => m.sender === 'user').length === 0) {
      onComplete(null);
      return;
    }
    setIsAnalyzing(true);
    const result = await analyzeConversation(messages);
    onComplete(result);
  }, [messages, onComplete]);

  const handleApplyHint = (text: string) => {
    setInput(text);
    setShowSmartHint(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white animate-fade-in relative">
      {/* Header */}
      <header className="flex-shrink-0 flex flex-col p-3 border-b border-[#F2F4F6]">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="w-6 h-6 text-[#8B95A1]" />
          </button>
          <img src={persona.avatar} alt={persona.name} className="w-10 h-10 rounded-full object-cover ml-2" />
          <div className="ml-3">
            <h2 className="font-bold text-lg text-[#191F28]">{persona.name}</h2>
            <p className="text-sm text-[#0AC5A8] font-semibold">🟢 온라인</p>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-2">
            {!isTutorialMode && (
              <button 
                onClick={() => setShowScoreTracker(!showScoreTracker)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <span className="text-sm font-bold text-pink-500">{conversationScore.total}점</span>
              </button>
            )}
            {isTutorialMode && <span className="font-bold text-[#F093B0]">{tutorialStep.step}/{TUTORIAL_STEPS.length} 단계</span>}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <HelpCircleIcon className="w-5 h-5 text-[#4F7ABA]" />
            </button>
          </div>
        </div>
        {isTutorialMode && (
          <div className="w-full bg-[#F2F4F6] h-1 rounded-full mt-2">
            <div className="bg-[#F093B0] h-1 rounded-full transition-all duration-500" style={{ width: `${(tutorialStep.step / TUTORIAL_STEPS.length) * 100}%` }}></div>
          </div>
        )}
      </header>

      {/* Score Tracker */}
      <ScoreTracker score={conversationScore} isVisible={showScoreTracker} />

      {/* Tutorial Card */}
      {isTutorialMode && (
        <div className="p-4 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] animate-fade-in">
          <p className="font-bold text-base flex items-center text-[#191F28]">
            <LightbulbIcon className="w-5 h-5 mr-2" />
            {tutorialStep.title}
          </p>
          <p className="text-sm text-[#8B95A1] mt-1">{tutorialStep.description}</p>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <img src={persona.avatar} alt="ai" className="w-8 h-8 rounded-full self-start" />}
            {msg.sender === 'system' 
              ? <div className="w-full text-center text-sm text-[#4F7ABA] p-3 bg-[#F9FAFB] rounded-xl my-2">{msg.text}</div>
              : <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 shadow-sm ${msg.sender === 'user' ? 'text-white rounded-t-[18px] rounded-l-[18px] rounded-br-[6px] bg-[#F093B0]' : 'rounded-t-[18px] rounded-r-[18px] rounded-bl-[6px] bg-[#F9FAFB] text-[#191F28]'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
            }
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <img src={persona.avatar} alt="ai" className="w-8 h-8 rounded-full self-start" />
            <div className="max-w-xs px-4 py-3 rounded-2xl rounded-bl-none bg-[#F9FAFB]"><TypingIndicator /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {realtimeFeedback && <RealtimeFeedbackToast feedback={realtimeFeedback} />}

      {/* Smart Hint Card */}
      <SmartHintCard
        hint={smartHint.hint}
        suggestions={smartHint.suggestions}
        onApply={handleApplyHint}
        onClose={() => setShowSmartHint(false)}
        isVisible={showSmartHint}
      />

      {/* Input Form */}
      <div className="flex-shrink-0 p-2 border-t border-[#F2F4F6] bg-white">
        {isTutorialMode && (
          <div className="flex space-x-2 overflow-x-auto pb-2 px-2">
            {tutorialStep.quickReplies.map(reply => (
              <button key={reply} onClick={() => handleSend(reply)} className="flex-shrink-0 h-10 px-4 bg-[#FDF2F8] border border-[#F093B0] text-[#DB7093] rounded-full text-sm font-medium transition-colors hover:bg-opacity-80">
                {reply}
              </button>
            ))}
          </div>
        )}
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend(input)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 w-full h-12 px-5 bg-[#F9FAFB] rounded-full focus:outline-none focus:ring-2 ring-[#F093B0]"
              disabled={isLoading || isAnalyzing}
            />
            <button 
              onClick={() => handleSend(input)} 
              disabled={isLoading || isAnalyzing || input.trim() === ''} 
              className="w-12 h-12 flex items-center justify-center bg-[#F093B0] text-white rounded-full disabled:opacity-50 transition-opacity hover:bg-pink-600"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-t-transparent border-[#F093B0] rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-bold text-[#191F28]">AI가 대화를 분석 중입니다...<br/>잠시만 기다려 주세요.</p>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
