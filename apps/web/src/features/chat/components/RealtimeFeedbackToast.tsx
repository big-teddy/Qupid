import React from "react";
import { RealtimeFeedback } from "@qupid/core";

export const RealtimeFeedbackToast: React.FC<{ feedback: RealtimeFeedback }> = ({
    feedback,
}) => (
    <div className="absolute bottom-24 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center animate-fade-in-up shadow-lg z-10">
        <span
            className={`mr-2 text-lg ${feedback.isGood ? "text-green-400" : "text-yellow-400"}`}
        >
            {feedback.isGood ? "✅" : "💡"}
        </span>
        <span className="text-sm font-medium">{feedback.message}</span>
    </div>
);
