import { jsx as _jsx } from "react/jsx-runtime";
import { useBadges } from "../../../shared/hooks/useBadges";
import BadgesScreen from "./BadgesScreen";
export const BadgesContainer = ({ onBack }) => {
  const { data: badges = [], isLoading } = useBadges();
  if (isLoading) {
    return _jsx("div", {
      className: "flex justify-center items-center h-screen",
      children: _jsx("div", {
        className:
          "animate-spin rounded-full h-12 w-12 border-b-2 border-[#0AC5A8]",
      }),
    });
  }
  return _jsx(BadgesScreen, { badges: badges, onBack: onBack });
};
