import React from "react";
import { AICoach, AI_COACHES } from "@qupid/core";
import { useCoaches } from "../../../shared/hooks/useCoaches";
import { CoachCard } from "./CoachCard";

interface CoachesSectionProps {
  onStartCoachChat?: (coach: AICoach) => void;
  onNavigateFallback: () => void;
}

export const CoachesSection: React.FC<CoachesSectionProps> = ({
  onStartCoachChat,
  onNavigateFallback,
}) => {
  const { data: apiCoaches = [] } = useCoaches();
  const coaches = apiCoaches.length > 0 ? apiCoaches : AI_COACHES;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">
          1:1 맞춤 코칭 🎓
        </h2>
        <p className="text-sm text-[#8B95A1] leading-relaxed">
          부족한 부분을 전문 코치와 함께 집중적으로 연습해보세요.
        </p>
      </div>
      <div className="space-y-3">
        {coaches.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onStart={() => {
              if (onStartCoachChat) {
                onStartCoachChat(coach);
              } else {
                onNavigateFallback();
              }
            }}
          />
        ))}
      </div>
    </section>
  );
};
