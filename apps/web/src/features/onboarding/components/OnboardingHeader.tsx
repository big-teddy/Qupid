import React from "react";
import { ArrowLeftIcon } from "@qupid/ui";
import { ProgressIndicator } from "./ProgressIndicator";

interface OnboardingHeaderProps {
  onBack?: () => void;
  progress: number;
  title?: string;
  questionNumber?: number;
}

/**
 * 온보딩 화면 공통 헤더
 */
export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onBack,
  progress,
  title,
  questionNumber,
}) => (
  <div className="px-4 py-3 bg-white">
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeftIcon className="w-6 h-6 text-[#4E5968]" />
      </button>
      <ProgressIndicator current={progress} total={4} />
      <div className="w-10" />
    </div>
    <div>
      {questionNumber && (
        <span className="text-sm font-medium text-[#0AC5A8] mb-1 block">
          Q{questionNumber}.
        </span>
      )}
      <h2 className="text-xl font-bold text-[#191F28] whitespace-pre-line">
        {title}
      </h2>
    </div>
  </div>
);

export default OnboardingHeader;
