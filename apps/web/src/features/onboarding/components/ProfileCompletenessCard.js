import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LEVEL_COLORS = {
    starter: 'from-gray-400 to-gray-500',
    growing: 'from-blue-400 to-blue-600',
    engaged: 'from-purple-400 to-purple-600',
    complete: 'from-pink-400 to-rose-500',
};
const LEVEL_LABELS = {
    starter: '시작 단계',
    growing: '성장 중',
    engaged: '활발한 사용자',
    complete: '프로필 완성!',
};
const LEVEL_ICONS = {
    starter: '🌱',
    growing: '🌿',
    engaged: '🌳',
    complete: '🌟',
};
export function ProfileCompletenessCard({ completeness, onStartCompletion, compact = false, }) {
    const { totalScore, level, nextReward } = completeness;
    // 미완료 항목 계산
    const incompleteItems = [
        !completeness.personality && '성격 체크',
        !completeness.conversationStyle && '대화 스타일',
        !completeness.mbti && 'MBTI',
        !completeness.attachmentStyle && '애착 유형',
        !completeness.relationshipGoals && '연애 가치관',
        !completeness.interests && '관심사',
    ].filter(Boolean);
    if (compact) {
        return (_jsxs("button", { onClick: onStartCompletion, className: `
          w-full p-3 rounded-xl
          bg-gradient-to-r ${LEVEL_COLORS[level]}
          text-white flex items-center justify-between
          hover:opacity-95 transition-opacity
        `, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: LEVEL_ICONS[level] }), _jsxs("span", { className: "font-medium", children: ["\uD504\uB85C\uD544 ", totalScore, "%"] })] }), nextReward && (_jsxs("span", { className: "text-xs opacity-80", children: ["\uB2E4\uC74C: ", nextReward.split('(')[0]] }))] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden", children: [_jsxs("div", { className: `p-4 bg-gradient-to-r ${LEVEL_COLORS[level]} text-white`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: LEVEL_ICONS[level] }), _jsxs("div", { children: [_jsx("p", { className: "font-bold", children: LEVEL_LABELS[level] }), _jsx("p", { className: "text-sm opacity-80", children: "\uD504\uB85C\uD544 \uC644\uC131\uB3C4" })] })] }), _jsxs("div", { className: "text-3xl font-bold", children: [totalScore, "%"] })] }), _jsx("div", { className: "mt-3 h-2 bg-white/30 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-white rounded-full transition-all duration-500", style: { width: `${totalScore}%` } }) })] }), _jsxs("div", { className: "p-4", children: [nextReward && (_jsxs("div", { className: "mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl", children: [_jsx("p", { className: "text-sm text-purple-600 dark:text-purple-300", children: "\uD83C\uDF81 \uB2E4\uC74C \uBCF4\uC0C1" }), _jsx("p", { className: "font-medium text-purple-800 dark:text-purple-200", children: nextReward })] })), incompleteItems.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-2", children: "\uC644\uC131\uD558\uBA74 \uB354 \uB098\uC740 \uACBD\uD5D8\uC744:" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [incompleteItems.slice(0, 3).map((item, idx) => (_jsx("span", { className: "px-3 py-1 bg-gray-100 dark:bg-gray-700 \n                    text-gray-600 dark:text-gray-300 rounded-full text-sm", children: item }, idx))), incompleteItems.length > 3 && (_jsxs("span", { className: "px-3 py-1 text-gray-400 text-sm", children: ["+", incompleteItems.length - 3, "\uAC1C"] }))] })] })), _jsx("button", { onClick: onStartCompletion, className: `
            w-full py-3 px-4 rounded-xl font-medium
            transition-colors
            ${level === 'complete'
                            ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-purple-500 text-white hover:bg-purple-600'}
          `, children: level === 'complete' ? '프로필 보기' : '프로필 완성하기' })] })] }));
}
/**
 * 미니 진행률 표시
 */
export function MiniProfileProgress({ completeness, onClick, }) {
    return (_jsxs("button", { onClick: onClick, className: "flex items-center gap-2 px-3 py-2 rounded-full \n        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700\n        transition-colors", children: [_jsx("span", { children: LEVEL_ICONS[completeness.level] }), _jsx("div", { className: "w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full bg-gradient-to-r ${LEVEL_COLORS[completeness.level]}`, style: { width: `${completeness.totalScore}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: [completeness.totalScore, "%"] })] }));
}
export default ProfileCompletenessCard;
