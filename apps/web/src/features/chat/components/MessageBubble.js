import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { CoachKeyIcon } from "@qupid/ui";
/**
 * Memoized Message Bubble component.
 * Only re-renders when message content or partner changes.
 */
export const MessageBubble = React.memo(
  ({ message, partner }) => {
    const isUser = message.sender === "user";
    const isSystem = message.sender === "system";
    const isAI = message.sender === "ai";
    if (isSystem) {
      return _jsx("div", {
        className:
          "w-full text-center text-sm text-[#4F7ABA] p-3 bg-[#F9FAFB] rounded-xl my-2",
        children:
          message.text === "COACH_HINT_INTRO"
            ? _jsxs("span", {
                className: "flex items-center justify-center",
                children: [
                  "\uB300\uD654\uAC00 \uB9C9\uD790 \uB550 \uC5B8\uC81C\uB4E0",
                  " ",
                  _jsx(CoachKeyIcon, {
                    className: "w-4 h-4 mx-1 inline-block text-yellow-500",
                  }),
                  " ",
                  "\uD78C\uD2B8 \uBC84\uD2BC\uC744 \uB20C\uB7EC AI \uCF54\uCE58\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC544\uBCF4\uC138\uC694!",
                ],
              })
            : message.text,
      });
    }
    return _jsxs("div", {
      className: `flex items-end gap-2 animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`,
      children: [
        isAI &&
          _jsx("img", {
            src: partner.avatar,
            alt: "ai",
            className: "w-8 h-8 rounded-full self-start",
          }),
        _jsx("div", {
          className: `max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 shadow-sm ${
            isUser
              ? "text-white rounded-t-[18px] rounded-l-[18px] rounded-br-[6px] bg-[#F093B0]"
              : "rounded-t-[18px] rounded-r-[18px] rounded-bl-[6px] bg-[#F9FAFB] text-[#191F28]"
          }`,
          children: _jsx("p", {
            className: "whitespace-pre-wrap leading-relaxed",
            children: message.text,
          }),
        }),
      ],
    });
  },
  (prevProps, nextProps) => {
    // Custom comparison: Only re-render if message text or sender changes
    return (
      prevProps.message.text === nextProps.message.text &&
      prevProps.message.sender === nextProps.message.sender &&
      prevProps.partner.avatar === nextProps.partner.avatar
    );
  },
);
MessageBubble.displayName = "MessageBubble";
