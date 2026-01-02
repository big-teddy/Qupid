import React from "react";

export const TypingIndicator: React.FC = () => (
    <div className="flex items-center justify-center space-x-1 p-2">
        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full animate-bounce bg-gray-500"></div>
    </div>
);
