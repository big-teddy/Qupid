import React from "react";
import { CheckIcon } from "@qupid/ui";

interface CheckableCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  checked: boolean;
  onClick: () => void;
  // Add data-testid to props to support testing
  "data-testid"?: string;
}

/**
 * 체크 가능한 선택 카드 컴포넌트
 */
export const CheckableCard: React.FC<CheckableCardProps> = ({
  icon,
  title,
  subtitle,
  checked,
  onClick,
  "data-testid": dataTestId,
}) => (
  <button
    onClick={onClick}
    data-testid={dataTestId}
    className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left relative flex items-center gap-4 ${
      checked
        ? "border-[#0AC5A8] bg-[#E6F7F5]"
        : "border-[#E5E8EB] bg-white hover:border-[#0AC5A8]/50"
    }`}
  >
    {icon && <span className="text-4xl">{icon}</span>}
    <div className="flex-1">
      <div className="font-bold text-lg text-[#191F28]">{title}</div>
      {subtitle && (
        <div className="text-sm text-[#8B95A1] mt-0.5">{subtitle}</div>
      )}
    </div>
    {checked && (
      <div className="w-6 h-6 bg-[#0AC5A8] rounded-full flex items-center justify-center">
        <CheckIcon className="w-4 h-4 text-white" />
      </div>
    )}
  </button>
);

export default CheckableCard;
