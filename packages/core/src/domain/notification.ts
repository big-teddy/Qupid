/**
 * Notification Types and Interfaces
 */

export type NotificationType = "system" | "coaching_complete" | "achievement";

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    link?: string; // Optional action link (e.g., /coaches/sessions/123)
    createdAt: string;
    metadata?: Record<string, any>; // Flexible metadata for specific types
}

export interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, any>;
}
