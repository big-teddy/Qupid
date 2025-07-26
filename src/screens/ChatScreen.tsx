
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Persona, Message, RealtimeFeedback, TutorialStep } from '../types/index';
import { createChatSession, sendMessageToAI, analyzeConversation, getRealtimeFeedback } from '../services/geminiService';
import { ArrowLeftIcon, PaperAirplaneIcon, LightbulbIcon, ThumbUpIcon } from '../components/Icons';
import { Chat } from '@google/genai';
import { TUTORIAL_STEPS } from '../constants/index';

interface ChatScreenProps {
  persona: Persona;
  isTutorial: boolean;
  onComplete: (analysis: any) => void;
  onBack: () => void;
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

const ChatScreen: React.FC<ChatScreenProps> = ({ persona, isTutorial, onComplete, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realtimeFeedback, setRealtimeFeedback] = useState<RealtimeFeedback | null>(null);
  
  const [isTutorialMode, setIsTutorialMode] = useState(isTutorial);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>(TUTORIAL_STEPS[0]);

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession(persona.systemInstruction);
    setIsTutorialMode(isTutorial); // Reset tutorial mode when persona changes
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

  const handleSend = useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isLoading || isAnalyzing || !chatSessionRef.current) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const lastAiMessage = messages.filter(m => m.sender === 'ai').pop()?.text;
    getRealtimeFeedback(messageText, lastAiMessage).then(setRealtimeFeedback);

    if (isTutorialMode) {
        if (tutorialStep.successCriteria(messageText, messages)) {
            const nextStepIndex = tutorialStep.step;
            if (nextStepIndex < TUTORIAL_STEPS.length) {
                setTutorialStep(TUTORIAL_STEPS[nextStepIndex]);
            } else {
                setIsTutorialMode(false); // Tutorial finished
            }
        }
    }

    try {
      const aiResponse = await sendMessageToAI(chatSessionRef.current, messageText);
      if (!aiResponse) {
        alert('AI 응답에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      alert('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isAnalyzing, messages, isTutorialMode, tutorialStep]);

  const handleComplete = useCallback(async () => {
    if (messages.filter(m => m.sender === 'user').length === 0) {
        onComplete(null); // No user messages, skip analysis
        return;
    }
    setIsAnalyzing(true);
    const result = await analyzeConversation(messages);
    onComplete(result);
  }, [messages, onComplete]);

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
            <div className="flex-1 text-right">
                {isTutorialMode && <span className="font-bold text-[#F093B0]">{tutorialStep.step}/{TUTORIAL_STEPS.length} 단계</span>}
            </div>
        </div>
        {isTutorialMode && (
            <div className="w-full bg-[#F2F4F6] h-1 rounded-full mt-2">
                <div className="bg-[#F093B0] h-1 rounded-full transition-all duration-500" style={{ width: `${(tutorialStep.step / TUTORIAL_STEPS.length) * 100}%` }}></div>
            </div>
        )}
      </header>

      {/* Tutorial Card */}
      {isTutorialMode && (
        <div className="p-4 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] animate-fade-in">
            <p className="font-bold text-base flex items-center text-[#191F28]"><LightbulbIcon className="w-5 h-5 mr-2" />{tutorialStep.title}</p>
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
            <button onClick={() => handleSend(input)} disabled={isLoading || isAnalyzing || input.trim() === ''} className="w-12 h-12 flex items-center justify-center bg-[#F093B0] text-white rounded-full disabled:opacity-50 transition-opacity">
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
