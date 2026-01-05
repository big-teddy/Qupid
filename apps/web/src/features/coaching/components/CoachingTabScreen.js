import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { DashboardSection } from "./DashboardSection";
import { RoleplaySection } from "./RoleplaySection";
import { CoachesSection } from "./CoachesSection";
import { LearningContentSection } from "./LearningContentSection";
const CoachingTabScreen = ({ onStartCoachChat, onStartRoleplay, }) => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex flex-col h-full w-full bg-[#F9FAFB]", children: [_jsx("header", { className: "flex-shrink-0 p-4 pt-5 bg-white border-b border-[#F2F4F6]", children: _jsx("h1", { className: "text-2xl font-bold text-[#191F28]", children: "\uCF54\uCE6D" }) }), _jsxs("main", { className: "flex-1 overflow-y-auto p-4 space-y-6 pb-24", children: [_jsx(DashboardSection, {}), _jsx(RoleplaySection, { onStartRoleplay: onStartRoleplay }), _jsx(CoachesSection, { onStartCoachChat: onStartCoachChat, onNavigateFallback: () => navigate("/chat/room") }), _jsx(LearningContentSection, {})] })] }));
};
export { CoachingTabScreen };
export default CoachingTabScreen;
