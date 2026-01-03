import React from "react";
import { AICoach } from "@qupid/core";

interface CoachCardProps {
  coach: AICoach;
  onStart: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onStart }) => (
  <div
    className="p-4 bg-white rounded-xl border border-[#F2F4F6] flex items-center space-x-4 transition-all hover:shadow-lg hover:border-[#DB7093] hover:-translate-y-0.5 cursor-pointer group"
    onClick={onStart}
  >
    <div className="flex-shrink-0">
      <img
        src={coach.avatar}
        alt={coach.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-[#DB7093] transition-colors"
      />
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-bold text-base text-[#191F28] mb-1">
        {coach.name} 코치
      </p>
      <p className="text-sm font-semibold text-[#4F7ABA] mb-1">
        {coach.specialty} 전문
      </p>
      <p className="text-xs text-[#8B95A1] leading-relaxed">{coach.tagline}</p>
    </div>

    <div className="flex-shrink-0">
      <button
        className="px-4 py-2 bg-[#FDF2F8] text-sm text-[#DB7093] font-bold rounded-full transition-all hover:bg-[#DB7093] hover:text-white hover:shadow-md whitespace-nowrap"
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
      >
        상담 시작
      </button>
    </div>
  </div>
);

export default CoachCard;
