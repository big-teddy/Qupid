import React from "react";

interface CoachHintProps {
    isLoading: boolean;
    suggestion: { reason?: string; suggestion: string } | null;
    onApply: (text: string) => void;
    onClose: () => void;
    onManual: () => void;
}

export const CoachHint: React.FC<CoachHintProps> = ({
    isLoading,
    suggestion,
    onApply,
    onClose,
    onManual,
}) => {
    if (!isLoading && !suggestion) return null;

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#191F28]">💡 코치 제안</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F093B0]"></div>
                        <p className="ml-3 text-sm text-gray-500">
                            코치가 제안을 준비하고 있어요...
                        </p>
                    </div>
                ) : suggestion ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-[#FDF2F8] rounded-xl border border-[#F093B0]">
                            <p className="text-sm text-[#191F28] leading-relaxed">
                                {suggestion.suggestion}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onApply(suggestion.suggestion)}
                                className="flex-1 py-2 px-4 bg-[#F093B0] text-white rounded-lg font-medium hover:bg-[#E085A3] transition-colors"
                            >
                                적용하기
                            </button>
                            <button
                                onClick={onManual}
                                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                직접 입력
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                            제안을 불러올 수 없습니다.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
