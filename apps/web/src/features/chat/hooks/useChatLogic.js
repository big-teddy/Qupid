import { useState, useRef, useEffect, useCallback } from "react";
import { TUTORIAL_STEPS, } from "@qupid/core";
import { useStreamingChat } from "../../../shared/hooks/useStreamingChat";
import { useChatSession, useSendMessage, useAnalyzeConversation, useRealtimeFeedback, useCoachSuggestion, } from "./useChatQueries";
import { useCreateCoachingSession, useAnalyzeCoachingSession, } from "../../coaching/hooks/useCoachingQueries";
import { useStyleAnalysis } from "./useStyleAnalysis";
import Logger from "../../../shared/utils/logger";
import { showGlobalToast } from "../../../shared/lib/toast";
export const useChatLogic = ({ partner, isTutorial, isCoaching, conversationMode, roleplayScenario, userProfile, onComplete, }) => {
    const [messages, setMessages] = useState([]);
    const [currentMode, setCurrentMode] = useState(conversationMode);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [realtimeFeedback, setRealtimeFeedback] = useState(null);
    const [isTutorialMode, setIsTutorialMode] = useState(isTutorial);
    // Tutorial State
    const [tutorialStep, setTutorialStep] = useState(TUTORIAL_STEPS[0]);
    const [isTutorialComplete, setIsTutorialComplete] = useState(false);
    const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
    // Coach Suggestion State
    const [showCoachHint, setShowCoachHint] = useState(false);
    const [coachSuggestion, setCoachSuggestion] = useState(null);
    const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);
    // Analysis State
    const [conversationAnalysis, setConversationAnalysis] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showStyleModal, setShowStyleModal] = useState(false);
    const [styleAnalysis, setStyleAnalysis] = useState(null);
    const sessionIdRef = useRef(null);
    // API Hooks
    const createSessionMutation = useChatSession();
    const sendMessageMutation = useSendMessage(); // Currently used via streaming
    const analyzeMutation = useAnalyzeConversation();
    const feedbackMutation = useRealtimeFeedback();
    const coachMutation = useCoachSuggestion();
    const styleAnalysisMutation = useStyleAnalysis();
    const createCoachingSessionMutation = useCreateCoachingSession();
    const analyzeCoachingMutation = useAnalyzeCoachingSession();
    // Streaming Hook
    const { isStreaming, streamingMessage, startStreaming, stopStreaming } = useStreamingChat({
        onMessageComplete: (message) => {
            setMessages((prev) => [...prev, message]);
            setIsLoading(false);
        },
        onError: (error) => {
            Logger.error("Streaming error:", error);
            setIsLoading(false);
        },
    });
    // Sync Tutorial Mode
    useEffect(() => {
        setIsTutorialMode(isTutorial);
    }, [isTutorial]);
    // --- Handlers ---
    const fetchAndShowSuggestion = useCallback(async () => {
        if (isFetchingSuggestion || showCoachHint || messages.length < 1)
            return;
        setShowCoachHint(true);
        setIsFetchingSuggestion(true);
        setCoachSuggestion(null);
        try {
            const suggestion = await coachMutation.mutateAsync({
                messages,
                persona: partner,
            });
            setCoachSuggestion(suggestion);
        }
        catch (error) {
            Logger.error("Failed to fetch contextual suggestion:", error);
            setCoachSuggestion({
                reason: "연결 문제",
                suggestion: "제안을 가져오는데 실패했습니다.",
            });
        }
        finally {
            setIsFetchingSuggestion(false);
        }
    }, [messages, isFetchingSuggestion, showCoachHint, coachMutation, partner]);
    const progressTutorialStep = useCallback((userMessage) => {
        if (!isTutorialMode || isTutorialComplete)
            return;
        const currentStep = TUTORIAL_STEPS[tutorialStepIndex];
        if (userMessage.length >= 5) {
            // Simple logic for now
            const nextIndex = tutorialStepIndex + 1;
            if (nextIndex < TUTORIAL_STEPS.length) {
                setTutorialStepIndex(nextIndex);
                setTutorialStep(TUTORIAL_STEPS[nextIndex]);
                const nextStep = TUTORIAL_STEPS[nextIndex];
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "system",
                            text: `✅ ${currentStep.step}단계 완료! 이제 ${nextStep.title}`,
                        },
                    ]);
                }, 1000);
            }
            else {
                Logger.info("🎉 튜토리얼 완료!");
                setIsTutorialComplete(true);
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "system",
                            text: "🎉 튜토리얼 완료! 이제 자유롭게 대화해보세요!",
                        },
                    ]);
                }, 1000);
            }
        }
        else {
            Logger.info("❌ 단계 조건 미충족");
        }
    }, [isTutorialMode, tutorialStepIndex, messages, isTutorialComplete]);
    const handleComplete = useCallback(async () => {
        try {
            setIsAnalyzing(true);
            let analysisResult;
            if (isCoaching) {
                analysisResult = await analyzeCoachingMutation.mutateAsync({
                    sessionId: sessionIdRef.current || "",
                    messages,
                });
            }
            else {
                const userMessages = messages.filter((m) => m.sender === "user");
                if (userMessages.length < 3 && !isTutorialMode) {
                    onComplete(null, false);
                    return;
                }
                analysisResult = await analyzeMutation.mutateAsync(messages);
            }
            setConversationAnalysis(analysisResult);
            if (isTutorialMode && isTutorialComplete) {
                onComplete(analysisResult, true);
            }
            else if (!isTutorialMode) {
                onComplete(analysisResult, false);
            }
            else {
                // Tutorial started but not finished, just show analysis
                onComplete(analysisResult, false);
            }
        }
        catch (error) {
            Logger.error("Analysis failed:", error);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [
        isCoaching,
        messages,
        isTutorialMode,
        isTutorialComplete,
        analyzeCoachingMutation,
        analyzeMutation,
        onComplete,
    ]);
    const handleSend = useCallback(async (messageText) => {
        if (messageText.trim() === "" ||
            isLoading ||
            isAnalyzing ||
            !sessionIdRef.current)
            return;
        setShowCoachHint(false);
        setCoachSuggestion(null);
        // Optimistic UI Update
        const previousMessages = [...messages];
        const userMessage = { sender: "user", text: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        progressTutorialStep(messageText);
        // Realtime Feedback
        const lastAiMessage = messages
            .filter((m) => m.sender === "ai")
            .pop()?.text;
        feedbackMutation.mutate({
            lastUserMessage: messageText,
            ...(lastAiMessage ? { lastAiMessage } : {}),
        }, { onSuccess: (feedback) => feedback && setRealtimeFeedback(feedback) });
        try {
            await startStreaming(sessionIdRef.current, messageText, { isCoaching });
            if (isTutorialMode && messages.length >= 4) {
                setTimeout(() => {
                    handleComplete();
                }, 1000);
            }
        }
        catch (error) {
            Logger.error("Failed to send message:", error);
            // Rollback Optimistic UI
            setMessages(previousMessages);
            setInput(messageText); // Restore input
            setIsLoading(false);
            showGlobalToast("메시지 전송에 실패했습니다. 다시 시도해주세요.", "error");
        }
    }, [
        isLoading,
        isAnalyzing,
        messages,
        isTutorialMode,
        progressTutorialStep,
        feedbackMutation,
        isCoaching,
        startStreaming,
        handleComplete,
    ]);
    // Initialize Session
    useEffect(() => {
        if (!sessionIdRef.current) {
            const initSession = async () => {
                try {
                    let sessionId;
                    if (isCoaching && partner && "specialty" in partner) {
                        const userId = localStorage.getItem("userId") || undefined;
                        sessionId = await createCoachingSessionMutation.mutateAsync({
                            coachId: partner.id,
                            userId,
                        });
                    }
                    else {
                        sessionId = await createSessionMutation.mutateAsync({
                            personaId: partner && "id" in partner
                                ? partner.id
                                : partner?.name || "unknown",
                            systemInstruction: roleplayScenario?.systemPrompt ||
                                partner?.system_instruction ||
                                "",
                        });
                    }
                    sessionIdRef.current = sessionId;
                }
                catch (error) {
                    Logger.error("Failed to create session:", error);
                    sessionIdRef.current = "mock-session-" + Date.now();
                }
            };
            initSession();
        }
        setIsTutorialMode(isTutorial);
        setTutorialStep(TUTORIAL_STEPS[0]);
        const initialMessages = [];
        if ("specialty" in partner) {
            initialMessages.push({
                sender: "system",
                text: `${partner.name} 코치와의 '${partner.specialty}' 코칭을 시작합니다.`,
            });
            initialMessages.push({ sender: "ai", text: partner.intro });
        }
        else if (roleplayScenario &&
            conversationMode === "roleplay") {
            initialMessages.push({
                sender: "system",
                text: `🎭 롤플레잉 미션: ${roleplayScenario.mission}`,
            });
            initialMessages.push({
                sender: "ai",
                text: roleplayScenario.initialMessage,
            });
        }
        else {
            if (isTutorial) {
                const currentStep = TUTORIAL_STEPS[0];
                initialMessages.push({
                    sender: "system",
                    text: `🎯 ${currentStep.title}`,
                });
            }
            const greeting = partner.intro || `안녕하세요! 저는 ${partner.name}입니다.`;
            setTimeout(() => {
                setMessages((prev) => {
                    if (prev.some((m) => m.sender === "ai"))
                        return prev;
                    return [...prev, { sender: "ai", text: greeting }];
                });
            }, 500);
        }
        setMessages(initialMessages);
    }, [
        isTutorial,
        userProfile,
        roleplayScenario,
        conversationMode,
        partner,
        isCoaching,
    ]);
    return {
        messages,
        setMessages,
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
        showAnalysisModal,
        setShowAnalysisModal,
        showStyleModal,
        setShowStyleModal,
        styleAnalysis,
        setStyleAnalysis,
        conversationAnalysis,
        styleAnalysisMutation,
        setCoachSuggestion,
        currentMode,
        setCurrentMode,
    };
};
