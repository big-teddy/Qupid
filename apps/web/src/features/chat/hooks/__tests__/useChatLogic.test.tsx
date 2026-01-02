import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChatLogic } from "../useChatLogic";
import { Persona } from "@qupid/core";
import { ReactNode } from "react";

// Mock the dependencies
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../../shared/stores/userStore", () => ({
    useUserStore: () => ({
        user: { id: "user-1", name: "User" },
    }),
}));

const { mockStartStreaming, mockUseSendMessage, mockCreateSession } = vi.hoisted(() => ({
    mockStartStreaming: vi.fn(),
    mockUseSendMessage: { mutateAsync: vi.fn().mockResolvedValue("AI Response") },
    mockCreateSession: vi.fn().mockResolvedValue("session-123"),
}));

vi.mock("../../../../shared/hooks/useStreamingChat", () => ({
    useStreamingChat: ({ onMessageComplete }: { onMessageComplete: (msg: any) => void }) => ({
        isStreaming: false,
        streamingMessage: "",
        startStreaming: mockStartStreaming.mockImplementation(async () => {
            onMessageComplete({ sender: "ai", text: "AI Response", timestamp: Date.now() });
            return Promise.resolve();
        }),
        stopStreaming: vi.fn(),
    }),
}));

vi.mock("../useChatQueries", () => ({
    useChatSession: () => ({
        mutateAsync: mockCreateSession,
    }),
    useSendMessage: () => mockUseSendMessage,
    useAnalyzeConversation: () => ({
        mutateAsync: vi.fn().mockResolvedValue({ totalScore: 90 }),
    }),
    useRealtimeFeedback: () => ({
        mutate: vi.fn(),
    }),
    useCoachSuggestion: () => ({
        mutateAsync: vi.fn().mockResolvedValue({ reason: "test", suggestion: "test" }),
    }),
    useGenerateDynamicPersonas: () => ({
        mutateAsync: vi.fn(),
    }),
}));

vi.mock("../../../coaching/hooks/useCoachingQueries", () => ({
    useCreateCoachingSession: () => ({
        mutateAsync: vi.fn().mockResolvedValue("coaching-session-123"),
    }),
    useSendCoachingMessage: () => ({
        mutateAsync: vi.fn(),
    }),
    useAnalyzeCoachingSession: () => ({
        mutateAsync: vi.fn(),
    }),
}));

vi.mock("../../../../shared/hooks/useStyleAnalysis", () => ({
    useStyleAnalysis: () => ({
        mutateAsync: vi.fn().mockResolvedValue({}),
    }),
}));

const mockPartner: Persona = {
    id: "p1",
    name: "Partner",
    age: 25,
    gender: "female",
    avatar: "avatar.png",
    intro: "Hi",
    job: "Developer",
    interests: [],
    system_instruction: "Be nice",
    conversation_preview: [],
    tags: [],
    match_rate: 90,
    mbti: "INTJ",
    personality_traits: [],
};

describe("useChatLogic", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("should initialize with default state", () => {
        const { result } = renderHook(
            () =>
                useChatLogic({
                    partner: mockPartner,
                    isTutorial: false,
                    isCoaching: false,
                    conversationMode: "normal",
                    onComplete: vi.fn(),
                }),
            { wrapper }
        );

        expect(result.current.messages).toHaveLength(0);
        expect(result.current.input).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("should initialize session on mount", async () => {
        renderHook(
            () =>
                useChatLogic({
                    partner: mockPartner,
                    isTutorial: false,
                    isCoaching: false,
                    conversationMode: "normal",
                    onComplete: vi.fn(),
                }),
            { wrapper }
        );

        // Wait for session initialization (useEffect)
        await waitFor(() => {
            // Check if session ID was set (indirectly via calls)
            expect(mockCreateSession).toHaveBeenCalled();
        });
    });

    it("should handle sending a message", async () => {
        const { result } = renderHook(
            () =>
                useChatLogic({
                    partner: mockPartner,
                    isTutorial: false,
                    isCoaching: false,
                    conversationMode: "normal",
                    onComplete: vi.fn(),
                }),
            { wrapper }
        );

        // Wait for session initialization
        await waitFor(() => {
            expect(mockCreateSession).toHaveBeenCalled();
        });

        await act(async () => {
            await result.current.handleSend("Hello");
        });

        await waitFor(() => {
            // Optimistic update + AI response
            expect(result.current.messages).toHaveLength(2);
            expect(result.current.messages[0].text).toBe("Hello");
            expect(result.current.messages[1].text).toBe("AI Response");
        });
    });

    it("should rollback on send failure", async () => {
        // Mock failure for startStreaming
        mockStartStreaming.mockRejectedValueOnce(new Error("Failed"));

        const { result } = renderHook(
            () =>
                useChatLogic({
                    partner: mockPartner,
                    isTutorial: false,
                    isCoaching: false,
                    conversationMode: "normal",
                    onComplete: vi.fn(),
                }),
            { wrapper }
        );

        // Wait for session initialization
        await waitFor(() => {
            expect(mockCreateSession).toHaveBeenCalled();
        });

        await act(async () => {
            await result.current.handleSend("Hello");
        });

        await waitFor(() => {
            // Should rollback optimistic update
            expect(result.current.messages).toHaveLength(0);
            expect(result.current.input).toBe("Hello"); // Input restored
        });
    });
});
