import React, { useEffect, useState } from "react";
import { Scenario } from "../data/scenarios";
import { scenarioService } from "../services/ScenarioService";

interface RoleplaySectionProps {
  onStartRoleplay?: (scenario: Scenario) => void;
}

export const RoleplaySection: React.FC<RoleplaySectionProps> = ({
  onStartRoleplay,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    const loadScenarios = async () => {
      const data = await scenarioService.getScenarios();
      setScenarios(data);
    };
    loadScenarios();
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#191F28] mb-1">
            실전 롤플레잉 🎭
          </h2>
          <p className="text-sm text-[#8B95A1]">
            다양한 상황을 미리 연습해보세요.
          </p>
        </div>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => onStartRoleplay?.(scenario)}
            className="flex-shrink-0 w-64 p-4 bg-white rounded-xl border border-[#F2F4F6] cursor-pointer transition-all hover:shadow-lg hover:border-purple-300 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-3xl">{scenario.emoji}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  scenario.difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : scenario.difficulty === "Normal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {scenario.difficulty}
              </span>
            </div>
            <h3 className="font-bold text-[#191F28] mb-1">{scenario.title}</h3>
            <p className="text-sm text-[#8B95A1] line-clamp-2">
              {scenario.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
