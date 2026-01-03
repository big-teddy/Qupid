import { jsx as _jsx } from "react/jsx-runtime";
export const LoadingSpinner = ({ size = "md", className = "", }) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    };
    return (_jsx("div", { className: `flex items-center justify-center ${className}`, children: _jsx("div", { className: `animate-spin rounded-full border-b-2 border-pink-500 ${sizeClasses[size]}` }) }));
};
