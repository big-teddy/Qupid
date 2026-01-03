import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NotificationItem } from "./NotificationItem";
export const NotificationList = ({ notifications, isLoading, onRead, onMarkAllRead, onDelete, onItemClick, }) => {
    if (isLoading) {
        return (_jsx("div", { className: "p-4 text-center text-gray-500", children: _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-12 bg-gray-200 rounded" }), _jsx("div", { className: "h-12 bg-gray-200 rounded" }), _jsx("div", { className: "h-12 bg-gray-200 rounded" })] }) }));
    }
    if (notifications.length === 0) {
        return (_jsx("div", { className: "p-8 text-center text-gray-500", children: _jsx("p", { children: "\uC0C8\uB85C\uC6B4 \uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 max-h-[500px] overflow-y-auto", children: [_jsxs("div", { className: "p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: "\uC54C\uB9BC" }), _jsx("button", { onClick: onMarkAllRead, className: "text-xs text-blue-500 hover:text-blue-600 font-medium", children: "\uBAA8\uB450 \uC77D\uC74C" })] }), _jsx("div", { className: "divide-y divide-gray-50", children: notifications.map((notification) => (_jsx(NotificationItem, { notification: notification, onRead: onRead, onDelete: onDelete, onClick: onItemClick }, notification.id))) })] }));
};
