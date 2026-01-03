import React from "react";
import { Notification } from "@qupid/core";
import { Bell, CheckCircle, Sparkles } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
  onClick,
}) => {
  const isUnread = !notification.isRead;

  const getIcon = () => {
    switch (notification.type) {
      case "achievement":
        return <Sparkles className="w-6 h-6 text-yellow-500" />;
      case "coaching_complete":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-blue-500" />;
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

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        isUnread ? "bg-blue-50/50" : "bg-white"
      }`}
    >
      <div className="flex-shrink-0 mr-3 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${isUnread ? "text-gray-900" : "text-gray-600"}`}
        >
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
      {isUnread && (
        <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
      )}
    </div>
  );
};
