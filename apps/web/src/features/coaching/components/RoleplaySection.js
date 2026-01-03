import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { scenarioService } from "../services/ScenarioService";
export const RoleplaySection = ({ onStartRoleplay, }) => {
    const [scenarios, setScenarios] = useState([]);
    useEffect(() => {
        const loadScenarios = async () => {
            const data = await scenarioService.getScenarios();
            setScenarios(data);
        };
        loadScenarios();
    }, []);
    return (_jsxs("section", { children: [_jsx("div", { className: "mb-4 flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-[#191F28] mb-1", children: "\uC2E4\uC804 \uB864\uD50C\uB808\uC789 \uD83C\uDFAD" }), _jsx("p", { className: "text-sm text-[#8B95A1]", children: "\uB2E4\uC591\uD55C \uC0C1\uD669\uC744 \uBBF8\uB9AC \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694." })] }) }), _jsx("div", { className: "flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide", children: scenarios.map((scenario) => (_jsxs("div", { onClick: () => onStartRoleplay?.(scenario), className: "flex-shrink-0 w-64 p-4 bg-white rounded-xl border border-[#F2F4F6] cursor-pointer transition-all hover:shadow-lg hover:border-purple-300 hover:-translate-y-0.5", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("span", { className: "text-3xl", children: scenario.emoji }), _jsx("span", { className: `text-xs px-2 py-1 rounded-full font-medium ${scenario.difficulty === "Easy"
                                        ? "bg-green-100 text-green-700"
                                        : scenario.difficulty === "Normal"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-red-100 text-red-700"}`, children: scenario.difficulty })] }), _jsx("h3", { className: "font-bold text-[#191F28] mb-1", children: scenario.title }), _jsx("p", { className: "text-sm text-[#8B95A1] line-clamp-2", children: scenario.description })] }, scenario.id))) })] }));
};
