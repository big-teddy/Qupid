import React from "react";

export const LearningContentSection: React.FC = () => {
  return (
    <section>
      <h2 className="font-bold text-lg px-1 mb-3">맞춤 학습 콘텐츠 💡</h2>
      <div className="space-y-3">
        {/* 추천 강의 카드 */}
        <div className="p-4 bg-white rounded-xl border border-[#F2F4F6] cursor-pointer transition-all hover:shadow-lg hover:border-blue-400 hover:-translate-y-0.5 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-blue-600 text-sm mb-2">
                추천 강의
              </p>
              <p className="font-bold text-base text-[#191F28] leading-tight mb-2">
                공감 능력 향상시키기: 상대의 마음을 얻는 3가지 질문법
              </p>
              <p className="text-sm text-[#8B95A1]">15분 강의 · 75% 수강</p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-blue-600 text-lg">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* 실전 팁 카드 */}
        <div className="p-4 bg-white rounded-xl border border-[#F2F4F6] cursor-pointer transition-all hover:shadow-lg hover:border-green-400 hover:-translate-y-0.5 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-green-600 text-sm mb-2">
                실전 팁
              </p>
              <p className="font-bold text-base text-[#191F28] leading-tight mb-2">
                어색한 침묵 깨기: 5가지 유용한 대화 주제
              </p>
              <p className="text-sm text-[#8B95A1]">3분 분량</p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <span className="text-green-600 text-lg">💡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
