import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, CheckCircle, Sparkles } from "lucide-react";
export const NotificationItem = ({ notification, onRead, onDelete, onClick, }) => {
    const isUnread = !notification.isRead;
    const getIcon = () => {
        switch (notification.type) {
            case "achievement":
                return _jsx(Sparkles, { className: "w-6 h-6 text-yellow-500" });
            case "coaching_complete":
                return _jsx(CheckCircle, { className: "w-6 h-6 text-green-500" });
            default:
                return _jsx(Bell, { className: "w-6 h-6 text-blue-500" });
        }
    };
    const handleClick = () => {
        if (isUnread) {
            onRead(notification.id);
        }
        if (onClick) {
            onClick(notification);
        }
    };
    return (_jsxs("div", { onClick: handleClick, className: `relative flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? "bg-blue-50/50" : "bg-white"}`, children: [_jsx("div", { className: "flex-shrink-0 mr-3 mt-1", children: getIcon() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: `text-sm font-medium ${isUnread ? "text-gray-900" : "text-gray-600"}`, children: notification.title }), _jsx("p", { className: "text-sm text-gray-500 mt-1 line-clamp-2", children: notification.message }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: new Date(notification.createdAt).toLocaleDateString() })] }), isUnread && (_jsx("span", { className: "absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" }))] }));
};
