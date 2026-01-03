import React from "react";
import { useBadges } from "../../../shared/hooks/useBadges";
import BadgesScreen from "./BadgesScreen";

interface BadgesContainerProps {
  onBack: () => void;
}

export const BadgesContainer: React.FC<BadgesContainerProps> = ({ onBack }) => {
  const { data: badges = [], isLoading } = useBadges();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0AC5A8]"></div>
      </div>
    );
  }

  return <BadgesScreen badges={badges} onBack={onBack} />;
};
