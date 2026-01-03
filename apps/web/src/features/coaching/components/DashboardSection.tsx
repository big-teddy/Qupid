import React, { useState } from "react";
import {
  useCoachingDashboard,
  useUpdateGoal,
  useCreateGoal,
} from "../hooks/useCoachingQueries";
import { RadarChart } from "./RadarChart";

interface Goal {
  id: string;
  title: string;
  status: "active" | "completed";
}

export const DashboardSection: React.FC = () => {
  const { data: dashboard, isLoading } = useCoachingDashboard();
  const updateGoal = useUpdateGoal();
  const createGoal = useCreateGoal();
  const [newGoal, setNewGoal] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading)
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  const stats = {
    friendliness: dashboard?.stats?.friendliness_exp || 10, // Default for visual
    curiosity: dashboard?.stats?.curiosity_exp || 10,
    empathy: dashboard?.stats?.empathy_exp || 10,
  };

  const handleToggleGoal = (goal: Goal) => {
    const newStatus = goal.status === "active" ? "completed" : "active";
    updateGoal.mutate({
      goalId: goal.id,
      status: newStatus,
      userId: "test-user",
    });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    createGoal.mutate({ title: newGoal, userId: "test-user" });
    setNewGoal("");
    setIsAdding(false);
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-extrabold text-[#191F28] mb-4 px-1 flex items-center">
        나의 코칭 리포트{" "}
        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          Beta
        </span>
      </h2>

      <div className="bg-white p-6 rounded-2xl border border-[#F2F4F6] shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

        {/* Level Badge */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <span className="text-2xl font-bold text-[#191F28] block">
              Lv.{dashboard?.stats?.total_level || 1}
            </span>
            <span className="text-sm text-[#4F7ABA] font-medium">
              {(dashboard?.stats?.total_level || 1) > 5
                ? "소통 마스터"
                : "소통 꿈나무 🌱"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-400 mb-1">Total Exp</div>
            <div className="font-mono font-bold text-gray-600">
              {(
                stats.friendliness +
                stats.curiosity +
                stats.empathy
              ).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6 relative z-10">
          <RadarChart data={stats} size={180} />
        </div>

        {/* Goals */}
        <div className="pt-5 border-t border-[#F2F4F6] relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#191F28] text-sm">
              이번 주 목표 🎯
            </h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-[#DB7093] font-bold hover:bg-pink-50 px-2 py-1 rounded-md transition-colors"
            >
              {isAdding ? "취소" : "+ 추가"}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddGoal} className="mb-3 flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="새로운 목표 입력..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#DB7093]"
                autoFocus
              />
              <button
                type="submit"
                disabled={createGoal.isPending}
                className="bg-[#DB7093] text-white text-sm px-3 py-2 rounded-lg font-bold disabled:opacity-50"
              >
                확인
              </button>
            </form>
          )}

          <div className="space-y-2">
            {dashboard?.goals?.length > 0 ? (
              dashboard.goals.map((g: Goal) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${
                    g.status === "completed"
                      ? "bg-gray-50 border-transparent"
                      : "bg-white border-gray-100 hover:border-[#DB7093] hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                      g.status === "completed"
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {g.status === "completed" && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 ${g.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"}`}
                  >
                    {g.title}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-xs text-gray-400">설정된 목표가 없습니다.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-xs text-[#4F7ABA] font-bold mt-1"
                >
                  목표 설정하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
