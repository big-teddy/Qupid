import { useState, useCallback, useRef } from "react";
import { getApiUrl } from "../../config/api";
import Logger from "../utils/logger";
export const useStreamingChat = (options = {}) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const abortControllerRef = useRef(null);
    const startStreaming = useCallback(async (sessionId, message, additionalParams = {}) => {
        if (isStreaming)
            return;
        setIsStreaming(true);
        setStreamingMessage("");
        // 이전 요청 취소
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            const apiUrl = getApiUrl();
            const endpoint = options.apiEndpoint || `${apiUrl}/chat/stream`;
            const authToken = localStorage.getItem("authToken");
            const headers = {
                "Content-Type": "application/json",
            };
            if (authToken) {
                headers["Authorization"] = `Bearer ${authToken}`;
            }
            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    sessionId,
                    message,
                    ...additionalParams,
                }),
                signal: abortControllerRef.current.signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("No response body");
            }
            const decoder = new TextDecoder();
            let fullMessage = "";
            let buffer = ""; // 버퍼 추가: 잘린 JSON 청크 처리용
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = (buffer + chunk).split("\n");
                buffer = lines.pop() || ""; // 마지막 조각은 버퍼에 저장 (완전하지 않을 수 있음)
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || !trimmedLine.startsWith("data: "))
                        continue;
                    const data = trimmedLine.slice(6);
                    if (data === "[DONE]") {
                        // 스트리밍 완료 처리
                        const finalMessage = {
                            sender: "ai",
                            text: fullMessage,
                            timestamp: Date.now(),
                        };
                        options.onMessageComplete?.(finalMessage);
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        // content 필드가 있는 경우
                        if (parsed.content) {
                            fullMessage += parsed.content;
                            setStreamingMessage(fullMessage);
                        }
                    }
                    catch (e) {
                        // 파싱 에러 시 로깅 후 무시 (다음 청크에서 해결될 수도 있음)
                        Logger.warn("JSON parse error in stream:", e, "Data:", data);
                    }
                }
            }
        }
        catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }
            Logger.error("Streaming error:", error);
            options.onError?.(error);
        }
        finally {
            setIsStreaming(false);
            setStreamingMessage("");
            abortControllerRef.current = null;
        }
    }, [isStreaming, options]);
    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsStreaming(false);
        setStreamingMessage("");
    }, []);
    return {
        isStreaming,
        streamingMessage,
        startStreaming,
        stopStreaming,
    };
};
