import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TUTORIAL_STEPS } from "@qupid/core";
import { ArrowLeftIcon, PaperAirplaneIcon, CoachKeyIcon } from "@qupid/ui";
import { useChatLogic } from "../hooks/useChatLogic";
import { StyleRecommendationModal } from "./StyleRecommendationModal";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { RealtimeFeedbackToast } from "./RealtimeFeedbackToast";
import { CoachHint } from "./CoachHint";
export const ChatScreen = (props) => {
  const {
    partner,
    isTutorial = false,
    isCoaching = false,
    conversationMode = "normal",
    roleplayScenario,
  } = props;
  // partner가 없으면 에러 처리
  if (!partner) {
    return _jsx("div", {
      className:
        "flex flex-col h-full w-full bg-white items-center justify-center",
      children: _jsx("p", {
        className: "text-[#8B95A1]",
        children:
          "\uB300\uD654 \uD30C\uD2B8\uB108\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.",
      }),
    });
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
  return _jsxs("div", {
    className: "flex flex-col h-full w-full bg-white relative",
    children: [
      _jsxs("header", {
        className:
          "flex-shrink-0 flex flex-col p-3 border-b border-[#F2F4F6] z-10 bg-white",
        children: [
          _jsxs("div", {
            className: "flex items-center",
            children: [
              _jsx("button", {
                onClick: handleComplete,
                className: "p-2 rounded-full hover:bg-gray-100",
                children: _jsx(ArrowLeftIcon, {
                  className: "w-6 h-6 text-[#8B95A1]",
                }),
              }),
              _jsx("img", {
                src: partner.avatar || "/icons/icon-192x192.png",
                alt: partner.name,
                className:
                  "w-10 h-10 rounded-full object-cover ml-2 bg-[#F2F4F6]",
                onError: (e) => {
                  e.target.src = "/icons/icon-192x192.png";
                },
              }),
              _jsxs("div", {
                className: "ml-3 flex-1",
                children: [
                  _jsx("h2", {
                    className: "font-bold text-lg text-[#191F28]",
                    children: partner.name,
                  }),
                  _jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      _jsx("p", {
                        className: "text-sm text-[#0AC5A8] font-semibold",
                        children: "\uD83D\uDFE2 \uC628\uB77C\uC778",
                      }),
                      !isTutorialMode &&
                        _jsx("span", {
                          className: `text-xs px-2 py-0.5 rounded-full font-medium ${
                            currentMode === "normal"
                              ? "bg-[#E6F7F5] text-[#0AC5A8]"
                              : "bg-[#FDF2F8] text-[#F093B0]"
                          }`,
                          children:
                            currentMode === "normal"
                              ? "👋 친구모드"
                              : "💕 연인모드",
                        }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  !isTutorialMode &&
                    !isCoaching &&
                    _jsx("button", {
                      onClick: () =>
                        setCurrentMode(
                          currentMode === "normal" ? "romantic" : "normal",
                        ),
                      className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                        currentMode === "normal"
                          ? "bg-[#FDF2F8] text-[#F093B0] border border-[#F093B0]"
                          : "bg-[#E6F7F5] text-[#0AC5A8] border border-[#0AC5A8]"
                      }`,
                      title: "\uB300\uD654 \uBAA8\uB4DC \uC804\uD658",
                      children:
                        currentMode === "normal"
                          ? "💕 연인 모드로"
                          : "👋 일반 모드로",
                    }),
                  !isTutorialMode &&
                    !isCoaching &&
                    messages.length > 3 &&
                    _jsx("button", {
                      onClick: async () => {
                        const result =
                          await styleAnalysisMutation.mutateAsync(messages);
                        setStyleAnalysis(result);
                        setShowStyleModal(true);
                      },
                      className:
                        "px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity",
                      children: "\uD83D\uDCA1 \uC2A4\uD0C0\uC77C \uBD84\uC11D",
                    }),
                  roleplayScenario &&
                    _jsx("span", {
                      className:
                        "px-3 py-1.5 bg-[#FDF2F8] text-[#DB7093] border border-[#DB7093] text-sm font-medium rounded-lg",
                      children: "\uD83C\uDFAD \uB864\uD50C\uB808\uC789",
                    }),
                  !isTutorialMode &&
                    isCoaching &&
                    "specialty" in partner &&
                    _jsxs("span", {
                      className:
                        "px-3 py-1.5 bg-[#E6F7F5] text-[#0AC5A8] border border-[#0AC5A8] text-sm font-medium rounded-lg",
                      children: [
                        "\uD83D\uDCDA ",
                        partner.specialty,
                        " \uCF54\uCE6D",
                      ],
                    }),
                  isTutorialMode &&
                    tutorialStep.step < 5 &&
                    _jsxs("span", {
                      className: "font-bold text-[#F093B0]",
                      children: [
                        tutorialStep.step,
                        "/",
                        TUTORIAL_STEPS.length - 1,
                        " \uB2E8\uACC4",
                      ],
                    }),
                ],
              }),
            ],
          }),
          isTutorialMode &&
            tutorialStep.step < 5 &&
            _jsx("div", {
              className: "w-full bg-[#F2F4F6] h-1 rounded-full mt-2",
              children: _jsx("div", {
                className:
                  "bg-[#F093B0] h-1 rounded-full transition-all duration-500",
                style: {
                  width: `${(tutorialStep.step / (TUTORIAL_STEPS.length - 1)) * 100}%`,
                },
              }),
            }),
        ],
      }),
      roleplayScenario &&
        _jsxs("div", {
          className:
            "p-4 bg-gradient-to-r from-[#F3E8FF] to-[#FDF2F8] animate-fade-in z-10 border-b border-purple-100",
          children: [
            _jsxs("p", {
              className: "font-bold text-base flex items-center text-[#6B21A8]",
              children: [
                _jsx("span", {
                  className: "mr-2 text-xl",
                  children: roleplayScenario.emoji,
                }),
                roleplayScenario.title,
              ],
            }),
            _jsxs("p", {
              className:
                "text-sm text-[#4C1D95] mt-1 font-medium bg-white/50 p-2 rounded-lg",
              children: [
                "\uD83C\uDFAF \uBBF8\uC158: ",
                roleplayScenario.mission,
              ],
            }),
          ],
        }),
      isTutorialMode &&
        tutorialStep.step < 5 &&
        _jsxs("div", {
          className:
            "p-4 bg-gradient-to-r from-[#FDF2F8] to-[#EBF2FF] animate-fade-in z-10",
          children: [
            _jsxs("p", {
              className: "font-bold text-base flex items-center text-[#191F28]",
              children: [
                _jsx("span", {
                  className: "mr-2 text-xl",
                  children: "\uD83D\uDCA1",
                }),
                tutorialStep.title,
              ],
            }),
            _jsx("p", {
              className: "text-sm text-[#8B95A1] mt-1",
              children: tutorialStep.description,
            }),
          ],
        }),
      _jsx(MessageList, {
        messages: messages,
        partner: partner,
        isStreaming: isStreaming,
        streamingMessage: streamingMessage,
        isLoading: isLoading,
        TypingIndicator: TypingIndicator,
      }),
      realtimeFeedback &&
        _jsx(RealtimeFeedbackToast, { feedback: realtimeFeedback }),
      showCoachHint &&
        _jsx(CoachHint, {
          isLoading: isFetchingSuggestion,
          suggestion: coachSuggestion,
          onApply: (text) => {
            setInput(text);
            handleCloseHint();
          },
          onClose: handleCloseHint,
          onManual: handleCloseHint,
        }),
      isAnalyzing &&
        _jsxs("div", {
          className:
            "absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-20",
          children: [
            _jsx("div", {
              className:
                "w-8 h-8 border-4 border-t-transparent border-[#F093B0] rounded-full animate-spin",
            }),
            _jsx("p", {
              className: "mt-4 text-base font-semibold text-[#191F28]",
              children: "\uB300\uD654 \uBD84\uC11D \uC911...",
            }),
          ],
        }),
      isTutorialComplete &&
        _jsx("div", {
          className:
            "absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 animate-fade-in",
          children: _jsxs("div", {
            className:
              "bg-white p-8 rounded-2xl text-center shadow-xl animate-scale-in",
            children: [
              _jsx("div", {
                className: "text-6xl mb-4",
                children: "\uD83C\uDF89",
              }),
              _jsx("h2", {
                className: "text-2xl font-bold text-[#191F28] mb-2",
                children: "\uD29C\uD1A0\uB9AC\uC5BC \uC644\uB8CC!",
              }),
              _jsx("p", {
                className: "text-[#8B95A1] text-base",
                children:
                  "\uB300\uD654\uC758 \uAE30\uBCF8\uC744 \uB9C8\uC2A4\uD130\uD558\uC168\uC5B4\uC694!",
              }),
              _jsx("p", {
                className: "text-[#4F7ABA] text-sm mt-2",
                children:
                  "\uACE7 \uD648 \uD654\uBA74\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4...",
              }),
            ],
          }),
        }),
      _jsxs("div", {
        className: "flex-shrink-0 p-2 border-t border-[#F2F4F6] bg-white z-10",
        children: [
          isTutorialMode &&
            tutorialStep.step < 5 &&
            _jsx("div", {
              className: "flex space-x-2 overflow-x-auto pb-2 px-2",
              children: tutorialStep.quickReplies.map((reply) =>
                _jsx(
                  "button",
                  {
                    onClick: () => handleSend(reply),
                    className:
                      "flex-shrink-0 h-10 px-4 bg-[#FDF2F8] border border-[#F093B0] text-[#DB7093] rounded-full text-sm font-medium transition-colors hover:bg-opacity-80",
                    children: reply,
                  },
                  reply,
                ),
              ),
            }),
          _jsx("div", {
            className: "p-2",
            children: _jsxs("div", {
              className: "flex items-center space-x-2",
              children: [
                (!isCoaching || conversationMode === "roleplay") &&
                  _jsx("button", {
                    onClick: fetchAndShowSuggestion,
                    disabled: isLoading || isAnalyzing || showCoachHint,
                    className:
                      "w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full disabled:opacity-50 transition-colors hover:bg-yellow-100",
                    children: _jsx(CoachKeyIcon, {
                      className: "w-6 h-6 text-yellow-500",
                    }),
                  }),
                _jsx("input", {
                  type: "text",
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyPress: (e) => e.key === "Enter" && handleSend(input),
                  placeholder:
                    "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694...",
                  className:
                    "flex-1 w-full h-12 px-5 bg-[#F9FAFB] rounded-full focus:outline-none focus:ring-2 ring-[#F093B0]",
                  disabled: isLoading || isAnalyzing,
                }),
                _jsx("button", {
                  onClick: () => handleSend(input),
                  disabled: isLoading || isAnalyzing || input.trim() === "",
                  className:
                    "w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F093B0] text-white rounded-full disabled:opacity-50 transition-opacity",
                  children: _jsx(PaperAirplaneIcon, { className: "w-6 h-6" }),
                }),
              ],
            }),
          }),
        ],
      }),
      _jsx(StyleRecommendationModal, {
        isOpen: showStyleModal,
        onClose: () => setShowStyleModal(false),
        analysis: styleAnalysis,
        isLoading: styleAnalysisMutation.isPending,
      }),
    ],
  });
};
export default ChatScreen;
