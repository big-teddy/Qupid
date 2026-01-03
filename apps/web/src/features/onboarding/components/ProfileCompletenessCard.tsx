/**
 * ProfileCompletenessCard - 프로필 완성도 카드 컴포넌트
 *
 * 게이미피케이션된 프로필 진행 상황 표시
 * 다음 보상과 미완료 항목 안내
 */

import React from "react";
import type { ProfileCompleteness } from "../services/ProgressiveProfileService";

interface ProfileCompletenessCardProps {
  completeness: ProfileCompleteness;
  onStartCompletion?: () => void;
  compact?: boolean;
}

const LEVEL_COLORS = {
  starter: "from-gray-400 to-gray-500",
  growing: "from-blue-400 to-blue-600",
  engaged: "from-purple-400 to-purple-600",
  complete: "from-pink-400 to-rose-500",
};

const LEVEL_LABELS = {
  starter: "시작 단계",
  growing: "성장 중",
  engaged: "활발한 사용자",
  complete: "프로필 완성!",
};

const LEVEL_ICONS = {
  starter: "🌱",
  growing: "🌿",
  engaged: "🌳",
  complete: "🌟",
};

export function ProfileCompletenessCard({
  completeness,
  onStartCompletion,
  compact = false,
}: ProfileCompletenessCardProps) {
  const { totalScore, level, nextReward } = completeness;

  // 미완료 항목 계산
  const incompleteItems = [
    !completeness.personality && "성격 체크",
    !completeness.conversationStyle && "대화 스타일",
    !completeness.mbti && "MBTI",
    !completeness.attachmentStyle && "애착 유형",
    !completeness.relationshipGoals && "연애 가치관",
    !completeness.interests && "관심사",
  ].filter(Boolean);

  if (compact) {
    return (
      <button
        onClick={onStartCompletion}
        className={`
          w-full p-3 rounded-xl
          bg-gradient-to-r ${LEVEL_COLORS[level]}
          text-white flex items-center justify-between
          hover:opacity-95 transition-opacity
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{LEVEL_ICONS[level]}</span>
          <span className="font-medium">프로필 {totalScore}%</span>
        </div>
        {nextReward && (
          <span className="text-xs opacity-80">
            다음: {nextReward.split("(")[0]}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* 헤더 그라디언트 */}
      <div className={`p-4 bg-gradient-to-r ${LEVEL_COLORS[level]} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{LEVEL_ICONS[level]}</span>
            <div>
              <p className="font-bold">{LEVEL_LABELS[level]}</p>
              <p className="text-sm opacity-80">프로필 완성도</p>
            </div>
          </div>
          <div className="text-3xl font-bold">{totalScore}%</div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${totalScore}%` }}
          />
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        {nextReward && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <p className="text-sm text-purple-600 dark:text-purple-300">
              🎁 다음 보상
            </p>
            <p className="font-medium text-purple-800 dark:text-purple-200">
              {nextReward}
            </p>
          </div>
        )}

        {/* 미완료 항목 */}
        {incompleteItems.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              완성하면 더 나은 경험을:
            </p>
            <div className="flex flex-wrap gap-2">
              {incompleteItems.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 
                    text-gray-600 dark:text-gray-300 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
              {incompleteItems.length > 3 && (
                <span className="px-3 py-1 text-gray-400 text-sm">
                  +{incompleteItems.length - 3}개
                </span>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <button
          onClick={onStartCompletion}
          className={`
            w-full py-3 px-4 rounded-xl font-medium
            transition-colors
            ${
              level === "complete"
                ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }
          `}
        >
          {level === "complete" ? "프로필 보기" : "프로필 완성하기"}
        </button>
      </div>
    </div>
  );
}

/**
 * 미니 진행률 표시
 */
export function MiniProfileProgress({
  completeness,
  onClick,
}: {
  completeness: ProfileCompleteness;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full 
        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors"
    >
      <span>{LEVEL_ICONS[completeness.level]}</span>
      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${LEVEL_COLORS[completeness.level]}`}
          style={{ width: `${completeness.totalScore}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {completeness.totalScore}%
      </span>
    </button>
  );
}

export default ProfileCompletenessCard;
