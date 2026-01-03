import React from "react";
import {
  Persona,
  ConversationAnalysis,
  AICoach,
  ConversationMode,
  TUTORIAL_STEPS,
  UserProfile,
} from "@qupid/core";
import { ArrowLeftIcon, PaperAirplaneIcon, CoachKeyIcon } from "@qupid/ui";
import { Scenario } from "../../coaching/data/scenarios";
import { useChatLogic } from "../hooks/useChatLogic";
import { StyleRecommendationModal } from "./StyleRecommendationModal";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { RealtimeFeedbackToast } from "./RealtimeFeedbackToast";
import { CoachHint } from "./CoachHint";

interface ChatScreenProps {
  partner?: Persona | AICoach;
  isTutorial?: boolean;
  isCoaching?: boolean;
  conversationMode?: ConversationMode;
  roleplayScenario?: Scenario;
  userProfile?: UserProfile;
  onComplete: (
    analysis: ConversationAnalysis | null,
    tutorialJustCompleted: boolean,
  ) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  const {
    partner,
    isTutorial = false,
    isCoaching = false,
    conversationMode = "normal",
    roleplayScenario,
  } = props;

  // partner가 없으면 에러 처리
  if (!partner) {
    return (
      <div className="flex flex-col h-full w-full bg-white items-center justify-center">
        <p className="text-[#8B95A1]">대화 파트너를 선택해주세요.</p>
      </div>
    );
  }

  const {
    messages,
    input,
    setInput,
    isLoading,
    isAnalyzing,
    isStreaming,
    streamingMessage,
    realtimeFeedback,
    tutorialStep,
    isTutorialMode,
    isTutorialComplete,
    showCoachHint,
    coachSuggestion,
    isFetchingSuggestion,
    handleSend,
    handleComplete,
    fetchAndShowSuggestion,
    setShowCoachHint,
    showStyleModal,
    setShowStyleModal,
    styleAnalysis,
    setStyleAnalysis,
    setShowAnalysisModal, // unused in UI but returned
    styleAnalysisMutation,
    conversationAnalysis,
    setCoachSuggestion, // needed for manual close
    currentMode,
    setCurrentMode,
  } = useChatLogic({
    ...props,
    isTutorial, // ensure defaults are passed if not in props, but useChatLogic handles params
    isCoaching,
    conversationMode,
    partner,
  });

  const handleCloseHint = () => {
    setShowCoachHint(false);
    setCoachSuggestion(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Header */}
      <header className="flex-shrink-0 flex flex-col p-3 border-b border-[#F2F4F6] z-10 bg-white">
        <div className="flex items-center">
          <button
            onClick={handleComplete}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6 text-[#8B95A1]" />
          </button>
          <img
            src={partner.avatar || "/icons/icon-192x192.png"}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover ml-2 bg-[#F2F4F6]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/icons/icon-192x192.png";
            }}
          />
          <div className="ml-3 flex-1">
            <h2 className="font-bold text-lg text-[#191F28]">{partner.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#0AC5A8] font-semibold">🟢 온라인</p>
              {!isTutorialMode && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentMode === "normal"
                    ? "bg-[#E6F7F5] text-[#0AC5A8]"
                    : "bg-[#FDF2F8] text-[#F093B0]"
                    }`}
                >
                  {currentMode === "normal" ? "👋 친구모드" : "💕 연인모드"}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isTutorialMode && !isCoaching && (
              <button
                onClick={() => setCurrentMode(currentMode === "normal" ? "romantic" : "normal")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all hover:scale-105 ${currentMode === "normal"
                  ? "bg-[#FDF2F8] text-[#F093B0] border border-[#F093B0]"
                  : "bg-[#E6F7F5] text-[#0AC5A8] border border-[#0AC5A8]"
                  }`}
                title="대화 모드 전환"
              >
                {currentMode === "normal" ? "💕 연인 모드로" : "👋 일반 모드로"}
              </button>
            )}
            {!isTutorialMode && !isCoaching && messages.length > 3 && (
              <button
                onClick={async () => {
                  const result = await styleAnalysisMutation.mutateAsync(messages);
                  setStyleAnalysis(result);
                  setShowStyleModal(true);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                💡 스타일 분석
              </button>
            )}
            {roleplayScenario && (
              <span className="px-3 py-1.5 bg-[#FDF2F8] text-[#DB7093] border border-[#DB7093] text-sm font-medium rounded-lg">
                🎭 롤플레잉
              </span>
            )}
            {!isTutorialMode && isCoaching && "specialty" in partner && (
              <span className="px-3 py-1.5 bg-[#E6F7F5] text-[#0AC5A8] border border-[#0AC5A8] text-sm font-medium rounded-lg">
                📚 {partner.specialty} 코칭
              </span>
            )}
            {isTutorialMode && tutorialStep.step < 5 && (
              <span className="font-bold text-[#F093B0]">
                {tutorialStep.step}/{TUTORIAL_STEPS.length - 1} 단계
              </span>
            )}
          </div>
        </div>
        {isTutorialMode && tutorialStep.step < 5 && (
          <div className="w-full bg-[#F2F4F6] h-1 rounded-full mt-2">
            <div
              className="bg-[#F093B0] h-1 rounded-full transition-all duration-500"
              style={{
                width: `${(tutorialStep.step / (TUTORIAL_STEPS.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
        )}
      </header>

      {/* Roleplay Mission Card */}
      {roleplayScenario && (
        <div className="p-4 bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] animate-fade-in z-10 border-b border-purple-100">
          <p className="font-bold text-base flex items-center text-[#6B21A8]">
            <span className="mr-2 text-xl">{roleplayScenario.emoji}</span>
            {roleplayScenario.title}
          </p>
          <p className="text-sm text-[#4C1D95] mt-1 font-medium bg-white/50 p-2 rounded-lg">
            🎯 미션: {roleplayScenario.mission}
          </p>
        </div>
      )}

      {/* Tutorial Card */}
      {isTutorialMode && tutorialStep.step < 5 && (
        <div className="p-4 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] animate-fade-in z-10">
          <p className="font-bold text-base flex items-center text-[#191F28]">
            <span className="mr-2 text-xl">💡</span>
            {tutorialStep.title}
          </p>
          <p className="text-sm text-[#8B95A1] mt-1">
            {tutorialStep.description}
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <MessageList
        messages={messages}
        partner={partner}
        isStreaming={isStreaming}
        streamingMessage={streamingMessage}
        isLoading={isLoading}
        TypingIndicator={TypingIndicator}
      />

      {/* Realtime Feedback */}
      {realtimeFeedback && (
        <RealtimeFeedbackToast feedback={realtimeFeedback} />
      )}

      {/* Coach Hint Modal */}
      {showCoachHint && (
        <CoachHint
          isLoading={isFetchingSuggestion}
          suggestion={coachSuggestion}
          onApply={(text) => {
            setInput(text);
            handleCloseHint();
          }}
          onClose={handleCloseHint}
          onManual={handleCloseHint}
        />
      )}

      {isAnalyzing && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-20">
          <div className="w-8 h-8 border-4 border-t-transparent border-[#F093B0] rounded-full animate-spin"></div>
          <p className="mt-4 text-base font-semibold text-[#191F28]">
            대화 분석 중...
          </p>
        </div>
      )}
      {isTutorialComplete && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl text-center shadow-xl animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#191F28] mb-2">
              튜토리얼 완료!
            </h2>
            <p className="text-[#8B95A1] text-base">
              대화의 기본을 마스터하셨어요!
            </p>
            <p className="text-[#4F7ABA] text-sm mt-2">
              곧 홈 화면으로 이동합니다...
            </p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="flex-shrink-0 p-2 border-t border-[#F2F4F6] bg-white z-10">
        {isTutorialMode && tutorialStep.step < 5 && (
          <div className="flex space-x-2 overflow-x-auto pb-2 px-2">
            {tutorialStep.quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="flex-shrink-0 h-10 px-4 bg-[#FDF2F8] border border-[#F093B0] text-[#DB7093] rounded-full text-sm font-medium transition-colors hover:bg-opacity-80"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        <div className="p-2">
          <div className="flex items-center space-x-2">
            {(!isCoaching || (conversationMode as string) === "roleplay") && (
              <button
                onClick={fetchAndShowSuggestion}
                disabled={isLoading || isAnalyzing || showCoachHint}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full disabled:opacity-50 transition-colors hover:bg-yellow-100"
              >
                <CoachKeyIcon className="w-6 h-6 text-yellow-500" />
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 w-full h-12 px-5 bg-[#F9FAFB] rounded-full focus:outline-none focus:ring-2 ring-[#F093B0]"
              disabled={isLoading || isAnalyzing}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || isAnalyzing || input.trim() === ""}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F093B0] text-white rounded-full disabled:opacity-50 transition-opacity"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Style Recommendation Modal */}
      <StyleRecommendationModal
        isOpen={showStyleModal}
        onClose={() => setShowStyleModal(false)}
        analysis={styleAnalysis}
        isLoading={styleAnalysisMutation.isPending}
      />
    </div>
  );
};
export default ChatScreen;
