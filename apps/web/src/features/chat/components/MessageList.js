import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
export const MessageList = React.memo(
  ({
    messages,
    partner,
    isStreaming,
    streamingMessage,
    isLoading,
    TypingIndicator,
  }) => {
    const messagesEndRef = useRef(null);
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStreaming, streamingMessage, isLoading]);
    return _jsxs("div", {
      className: "flex-1 overflow-y-auto p-4 space-y-4",
      children: [
        messages.map((msg, index) =>
          _jsx(
            MessageBubble,
            { message: msg, partner: partner },
            `msg-${index}`,
          ),
        ),
        isStreaming &&
          streamingMessage &&
          _jsxs("div", {
            className: "flex items-end gap-2 justify-start",
            children: [
              _jsx("img", {
                src: partner.avatar,
                alt: "ai",
                className: "w-8 h-8 rounded-full self-start",
              }),
              _jsxs("div", {
                className:
                  "max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-t-[18px] rounded-r-[18px] rounded-bl-[6px] bg-[#F9FAFB] text-[#191F28]",
                children: [
                  _jsx("p", {
                    className: "whitespace-pre-wrap leading-relaxed",
                    children: streamingMessage,
                  }),
                  _jsx("span", {
                    className:
                      "inline-block w-2 h-4 bg-[#F093B0] ml-1 animate-pulse",
                  }),
                ],
              }),
            ],
          }),
        isLoading &&
          !isStreaming &&
          _jsxs("div", {
            className: "flex items-end gap-2 justify-start",
            children: [
              _jsx("img", {
                src: partner.avatar,
                alt: "ai",
                className: "w-8 h-8 rounded-full self-start",
              }),
              _jsx("div", {
                className:
                  "max-w-xs px-4 py-3 rounded-2xl rounded-bl-none bg-[#F9FAFB]",
                children: _jsx(TypingIndicator, {}),
              }),
            ],
          }),
        _jsx("div", { ref: messagesEndRef }),
      ],
    });
  },
);
