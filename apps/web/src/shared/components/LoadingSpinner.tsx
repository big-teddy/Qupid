import React from "react";

export const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
        </div>
    </div>
);
