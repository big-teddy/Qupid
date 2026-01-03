import React, { useEffect, useRef } from "react";
import { Message, Persona, AICoach } from "@qupid/core";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  partner: Persona | AICoach;
  isStreaming: boolean;
  streamingMessage: string;
  isLoading: boolean;
  TypingIndicator: React.FC;
}

export const MessageList: React.FC<MessageListProps> = React.memo(
  ({
    messages,
    partner,
    isStreaming,
    streamingMessage,
    isLoading,
    TypingIndicator,
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStreaming, streamingMessage, isLoading]);

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble key={`msg-${index}`} message={msg} partner={partner} />
        ))}

        {/* 🚀 스트리밍 메시지 표시 */}
        {isStreaming && streamingMessage && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src={partner.avatar}
              alt="ai"
              className="w-8 h-8 rounded-full self-start"
            />
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-t-[18px] rounded-r-[18px] rounded-bl-[6px] bg-[#F9FAFB] text-[#191F28]">
              <p className="whitespace-pre-wrap leading-relaxed">
                {streamingMessage}
              </p>
              <span className="inline-block w-2 h-4 bg-[#F093B0] ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {isLoading && !isStreaming && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src={partner.avatar}
              alt="ai"
              className="w-8 h-8 rounded-full self-start"
            />
            <div className="max-w-xs px-4 py-3 rounded-2xl rounded-bl-none bg-[#F9FAFB]">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  },
);
