import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useCoachingDashboard, useUpdateGoal, useCreateGoal } from '../hooks/useCoachingQueries';
import { RadarChart } from './RadarChart';
export const DashboardSection = () => {
    const { data: dashboard, isLoading } = useCoachingDashboard();
    const updateGoal = useUpdateGoal();
    const createGoal = useCreateGoal();
    const [newGoal, setNewGoal] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    if (isLoading)
        return _jsx("div", { className: "h-48 flex items-center justify-center text-gray-400", children: "Loading..." });
    const stats = {
        friendliness: dashboard?.stats?.friendliness_exp || 10, // Default for visual
        curiosity: dashboard?.stats?.curiosity_exp || 10,
        empathy: dashboard?.stats?.empathy_exp || 10
    };
    const handleToggleGoal = (goal) => {
        const newStatus = goal.status === 'active' ? 'completed' : 'active';
        updateGoal.mutate({ goalId: goal.id, status: newStatus, userId: 'test-user' });
    };
    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoal.trim())
            return;
        createGoal.mutate({ title: newGoal, userId: 'test-user' });
        setNewGoal("");
        setIsAdding(false);
    };
    return (_jsxs("section", { className: "mb-6", children: [_jsxs("h2", { className: "text-xl font-extrabold text-[#191F28] mb-4 px-1 flex items-center", children: ["\uB098\uC758 \uCF54\uCE6D \uB9AC\uD3EC\uD2B8 ", _jsx("span", { className: "ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full", children: "Beta" })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-[#F2F4F6] shadow-sm relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" }), _jsxs("div", { className: "flex items-center justify-between mb-6 relative z-10", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-2xl font-bold text-[#191F28] block", children: ["Lv.", dashboard?.stats?.total_level || 1] }), _jsx("span", { className: "text-sm text-[#4F7ABA] font-medium", children: (dashboard?.stats?.total_level || 1) > 5 ? '소통 마스터' : '소통 꿈나무 🌱' })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("div", { className: "text-xs text-gray-400 mb-1", children: "Total Exp" }), _jsx("div", { className: "font-mono font-bold text-gray-600", children: (stats.friendliness + stats.curiosity + stats.empathy).toLocaleString() })] })] }), _jsx("div", { className: "mb-6 relative z-10", children: _jsx(RadarChart, { data: stats, size: 180 }) }), _jsxs("div", { className: "pt-5 border-t border-[#F2F4F6] relative z-10", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "font-bold text-[#191F28] text-sm", children: "\uC774\uBC88 \uC8FC \uBAA9\uD45C \uD83C\uDFAF" }), _jsx("button", { onClick: () => setIsAdding(!isAdding), className: "text-xs text-[#DB7093] font-bold hover:bg-pink-50 px-2 py-1 rounded-md transition-colors", children: isAdding ? '취소' : '+ 추가' })] }), isAdding && (_jsxs("form", { onSubmit: handleAddGoal, className: "mb-3 flex gap-2", children: [_jsx("input", { type: "text", value: newGoal, onChange: e => setNewGoal(e.target.value), placeholder: "\uC0C8\uB85C\uC6B4 \uBAA9\uD45C \uC785\uB825...", className: "flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#DB7093]", autoFocus: true }), _jsx("button", { type: "submit", disabled: createGoal.isPending, className: "bg-[#DB7093] text-white text-sm px-3 py-2 rounded-lg font-bold disabled:opacity-50", children: "\uD655\uC778" })] })), _jsx("div", { className: "space-y-2", children: dashboard?.goals?.length > 0 ? (dashboard.goals.map((g) => (_jsxs("div", { onClick: () => handleToggleGoal(g), className: `flex items-center p-3 rounded-lg cursor-pointer transition-all border ${g.status === 'completed'
                                        ? 'bg-gray-50 border-transparent'
                                        : 'bg-white border-gray-100 hover:border-[#DB7093] hover:shadow-sm'}`, children: [_jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${g.status === 'completed'
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-300'}`, children: g.status === 'completed' && _jsx("span", { className: "text-white text-xs", children: "\u2713" }) }), _jsx("span", { className: `text-sm flex-1 ${g.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`, children: g.title })] }, g.id)))) : (_jsxs("div", { className: "text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200", children: [_jsx("p", { className: "text-xs text-gray-400", children: "\uC124\uC815\uB41C \uBAA9\uD45C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx("button", { onClick: () => setIsAdding(true), className: "text-xs text-[#4F7ABA] font-bold mt-1", children: "\uBAA9\uD45C \uC124\uC815\uD558\uAE30" })] })) })] })] })] }));
};
