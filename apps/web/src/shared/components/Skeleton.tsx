import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circle" | "card" | "rectangle";
    width?: string | number;
    height?: string | number;
    count?: number;
}

/**
 * Skeleton loader component for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "rectangle",
    width,
    height,
    count = 1,
}) => {
    const baseClass = "skeleton";

    const variantClasses = {
        text: "skeleton-text",
        circle: "skeleton-circle",
        card: "skeleton-card",
        rectangle: "",
    };

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    const elements = Array.from({ length: count }, (_, index) => (
        <div
            key={index}
            className={`${baseClass} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    ));

    return <>{elements}</>;
};

/**
 * Card skeleton for persona cards, coaching cards, etc.
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`bg-white rounded-2xl p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="circle" width={48} height={48} />
            <div className="flex-1">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
        <Skeleton variant="text" count={2} />
        <Skeleton variant="text" width="75%" />
    </div>
);

/**
 * Chat message skeleton
 */
export const MessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && <Skeleton variant="circle" width={32} height={32} />}
        <Skeleton
            className={isUser ? "ml-auto" : ""}
            width={isUser ? "60%" : "70%"}
            height={60}
        />
    </div>
);

/**
 * List item skeleton
 */
export const ListItemSkeleton: React.FC = () => (
    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="80%" />
        </div>
        <Skeleton width={60} height={24} />
    </div>
);

/**
 * Profile skeleton
 */
export const ProfileSkeleton: React.FC = () => (
    <div className="flex flex-col items-center p-6">
        <Skeleton variant="circle" width={80} height={80} className="mb-4" />
        <Skeleton variant="text" width={120} className="mb-2" />
        <Skeleton variant="text" width={180} />
    </div>
);

/**
 * Stats card skeleton
 */
export const StatsSkeleton: React.FC = () => (
    <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <Skeleton width={40} height={40} className="mb-2" />
                <Skeleton variant="text" width={60} />
            </div>
        ))}
    </div>
);

export default Skeleton;
