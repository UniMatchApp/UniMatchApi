import { Notification } from "../../domain/Notification";

export interface IAppNotifications {
    sendNotification(notification: Notification): Promise<void>;
    sendNotificationToMany(notifications: Notification[]): Promise<void>;
    checkNotificationStatus(notification: Notification): Promise<boolean>;
}
