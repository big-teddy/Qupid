import React from "react";
import { useNavigate } from "react-router-dom";
import { AICoach } from "@qupid/core";
import { DashboardSection } from "./DashboardSection";
import { RoleplaySection } from "./RoleplaySection";
import { CoachesSection } from "./CoachesSection";
import { LearningContentSection } from "./LearningContentSection";
import { Scenario } from "../data/scenarios";

interface CoachingTabScreenProps {
  onStartCoachChat?: (coach: AICoach) => void;
  onStartRoleplay?: (scenario: Scenario) => void;
}

const CoachingTabScreen: React.FC<CoachingTabScreenProps> = ({
  onStartCoachChat,
  onStartRoleplay,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full bg-[#F9FAFB]">
      <header className="flex-shrink-0 p-4 pt-5 bg-white border-b border-[#F2F4F6]">
        <h1 className="text-2xl font-bold text-[#191F28]">코칭</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* 📈 Dashboard Section */}
        <DashboardSection />

        {/* 🎭 실전 롤플레잉 섹션 */}
        <RoleplaySection onStartRoleplay={onStartRoleplay} />

        {/* 🚀 1:1 맞춤 코칭 섹션 */}
        <CoachesSection
          onStartCoachChat={onStartCoachChat}
          onNavigateFallback={() => navigate("/chat/room")}
        />

        {/* 🚀 맞춤 학습 콘텐츠 섹션 */}
        <LearningContentSection />
      </main>
    </div>
  );
};

export { CoachingTabScreen };
export default CoachingTabScreen;
