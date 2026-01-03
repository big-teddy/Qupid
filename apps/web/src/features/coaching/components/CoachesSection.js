import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AI_COACHES } from "@qupid/core";
import { useCoaches } from "../../../shared/hooks/useCoaches";
import { CoachCard } from "./CoachCard";
export const CoachesSection = ({ onStartCoachChat, onNavigateFallback }) => {
  const { data: apiCoaches = [] } = useCoaches();
  const coaches = apiCoaches.length > 0 ? apiCoaches : AI_COACHES;
  return _jsxs("section", {
    children: [
      _jsxs("div", {
        className: "mb-4",
        children: [
          _jsx("h2", {
            className: "text-lg font-bold text-[#191F28] mb-2",
            children: "1:1 \uB9DE\uCDA4 \uCF54\uCE6D \uD83C\uDF93",
          }),
          _jsx("p", {
            className: "text-sm text-[#8B95A1] leading-relaxed",
            children:
              "\uBD80\uC871\uD55C \uBD80\uBD84\uC744 \uC804\uBB38 \uCF54\uCE58\uC640 \uD568\uAED8 \uC9D1\uC911\uC801\uC73C\uB85C \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694.",
          }),
        ],
      }),
      _jsx("div", {
        className: "space-y-3",
        children: coaches.map((coach) =>
          _jsx(
            CoachCard,
            {
              coach: coach,
              onStart: () => {
                if (onStartCoachChat) {
                  onStartCoachChat(coach);
                } else {
                  onNavigateFallback();
                }
              },
            },
            coach.id,
          ),
        ),
      }),
    ],
  });
};
