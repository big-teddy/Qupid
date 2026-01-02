import React from "react";

interface ProgressIndicatorProps {
    current: number;
    total: number;
}

/**
 * 온보딩 진행률 표시 컴포넌트
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    current,
    total,
}) => (
    <div className="flex gap-1.5 w-full max-w-[180px] mx-auto">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < current ? "bg-[#0AC5A8]" : "bg-[#E5E8EB]"
                    }`}
            />
        ))}
    </div>
);

export default ProgressIndicator;
