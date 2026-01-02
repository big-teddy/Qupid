import { renderHook, act, waitFor } from "@testing-library/react";
import { useStreamingChat } from "./useStreamingChat";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// TextDecoder Polyfill if needed (JSDOM usually has it now, but just in case)
if (typeof TextDecoder === "undefined") {
    const { TextDecoder } = require("util");
    global.TextDecoder = TextDecoder;
}

describe("useStreamingChat", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // LocalStorage Mock
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: vi.fn(() => "test-token"),
            },
            writable: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should initialize with default states", () => {
        const { result } = renderHook(() => useStreamingChat());
        expect(result.current.isStreaming).toBe(false);
        expect(result.current.streamingMessage).toBe("");
    });

    it("should start streaming and update message", async () => {
        const onMessageComplete = vi.fn();
        const { result } = renderHook(() =>
            useStreamingChat({ onMessageComplete })
        );

        // Mock Fetch with explicit reader control
        const encoder = new TextEncoder();
        let callCount = 0;
        const mockReader = {
            read: vi.fn().mockImplementation(async () => {
                callCount++;
                console.log(`MockReader read called: ${callCount}`);

                // Add explicit delay to allow React state updates to propagate
                await new Promise(resolve => setTimeout(resolve, 50));

                if (callCount === 1) return { done: false, value: encoder.encode('data: {"content": "Hello"}\n\n') };
                if (callCount === 2) return { done: false, value: encoder.encode('data: {"content": " World"}\n\n') };
                if (callCount === 3) return { done: false, value: encoder.encode('data: [DONE]\n\n') };
                return { done: true, value: undefined };
            }),
            cancel: vi.fn(),
        };

        const mockResponse = {
            ok: true,
            body: {
                getReader: () => mockReader,
            },
            headers: new Headers(),
        };

        const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(mockResponse as any);

        await act(async () => {
            // Do not await logic here, so we can check intermediate states or final state via waitFor
            result.current.startStreaming("session-123", "Hi", {
                isCoaching: true,
            });
        });

        // act가 끝난 시점에는 이미 스트리밍이 완료되었을 것임 (mockStream이 즉시 완료되므로)
        // 따라서 isStreaming 검증은 생략하고 결과만 확인

        // Wait for stream processing (React state update might need a tick)
        await waitFor(() => {
            expect(result.current.streamingMessage).toBe("Hello World");
        });

        // Check cleanup
        await waitFor(() => {
            expect(result.current.isStreaming).toBe(false);
        });
        expect(onMessageComplete).toHaveBeenCalledWith(
            expect.objectContaining({
                text: "Hello World",
                sender: "ai"
            })
        );
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.stringContaining("/chat/stream"),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer test-token"
                }),
                body: expect.stringContaining("session-123")
            })
        );
    });

    it("should handle error during fetch", async () => {
        const onError = vi.fn();
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { }); // Suppress console.error
        const { result } = renderHook(() => useStreamingChat({ onError }));

        vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

        await act(async () => {
            await result.current.startStreaming("id", "msg");
        });

        expect(onError).toHaveBeenCalled();
        expect(result.current.isStreaming).toBe(false);
        consoleSpy.mockRestore();
    });
});
