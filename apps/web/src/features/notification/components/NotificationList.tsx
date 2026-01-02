import React from "react";
import { Notification } from "@qupid/core";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
    notifications: Notification[];
    isLoading: boolean;
    onRead: (id: string) => void;
    onMarkAllRead: () => void;
    onDelete: (id: string) => void;
    onItemClick?: (notification: Notification) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    isLoading,
    onRead,
    onMarkAllRead,
    onDelete,
    onItemClick,
}) => {
    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>새로운 알림이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-[500px] overflow-y-auto">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-700">알림</h3>
                <button
                    onClick={onMarkAllRead}
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                    모두 읽음
                </button>
            </div>
            <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={onRead}
                        onDelete={onDelete}
                        onClick={onItemClick}
                    />
                ))}
            </div>
        </div>
    );
};
