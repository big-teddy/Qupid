import React from "react";
import { Message, Persona, AICoach } from "@qupid/core";
import { CoachKeyIcon } from "@qupid/ui";

interface MessageBubbleProps {
    message: Message;
    partner: Persona | AICoach;
}

/**
 * Memoized Message Bubble component.
 * Only re-renders when message content or partner changes.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, partner }) => {
    const isUser = message.sender === "user";
    const isSystem = message.sender === "system";
    const isAI = message.sender === "ai";

    if (isSystem) {
        return (
            <div className="w-full text-center text-sm text-[#4F7ABA] p-3 bg-[#F9FAFB] rounded-xl my-2">
                {message.text === "COACH_HINT_INTRO" ? (
                    <span className="flex items-center justify-center">
                        대화가 막힐 땐 언제든{" "}
                        <CoachKeyIcon className="w-4 h-4 mx-1 inline-block text-yellow-500" />{" "}
                        힌트 버튼을 눌러 AI 코치의 도움을 받아보세요!
                    </span>
                ) : (
                    message.text
                )}
            </div>
        );
    }

    return (
        <div
            className={`flex items-end gap-2 animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}
        >
            {isAI && (
                <img
                    src={partner.avatar}
                    alt="ai"
                    className="w-8 h-8 rounded-full self-start"
                />
            )}
            <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 shadow-sm ${isUser
                        ? "text-white rounded-t-[18px] rounded-l-[18px] rounded-br-[6px] bg-[#F093B0]"
                        : "rounded-t-[18px] rounded-r-[18px] rounded-bl-[6px] bg-[#F9FAFB] text-[#191F28]"
                    }`}
            >
                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: Only re-render if message text or sender changes
    return (
        prevProps.message.text === nextProps.message.text &&
        prevProps.message.sender === nextProps.message.sender &&
        prevProps.partner.avatar === nextProps.partner.avatar
    );
});

MessageBubble.displayName = "MessageBubble";
