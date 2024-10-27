import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {Notification} from "@/core/uniMatch/notifications/domain/Notification";

export class InMemoryNotificationRepository implements INotificationsRepository {
    private notifications: { [id: string]: Notification } = {};

    async create(entity: Notification): Promise<void> {
        const id = entity.getId().toString();
        this.notifications[id] = entity;
    }

    async deleteAll(): Promise<void> {
        this.notifications = {};
    }

    async deleteAllNotificationsByRecipient(recipient: string): Promise<void> {
        this.notifications = Object.fromEntries(
            Object.entries(this.notifications).filter(([_, notification]) => notification.recipient !== recipient)
        );
    }

    async deleteById(id: string): Promise<void> {
        if (!this.notifications[id]) {
            throw new Error(`Notification with ID ${id} does not exist.`);
        }
        delete this.notifications[id];
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.notifications;
    }

    async findAll(): Promise<Notification[]> {
        return Object.values(this.notifications);
    }

    async findById(id: string): Promise<Notification | null> {
        return this.notifications[id] || null;
    }

    async findByTypeAndTypeId(type: string, typeId: string): Promise<Notification[]> {
        return Object.values(this.notifications).filter(
            notification => notification.type === type && notification.contentId === typeId
        );
    }

    async findLastNotificationByTypeAndTypeId(type: string, typeId: string): Promise<Notification | null> {
        return Object.values(this.notifications)
            .filter(notification => notification.type === type && notification.contentId === typeId)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;
    }

    async getAllNotifications(userId: string): Promise<Notification[]> {
        return Object.values(this.notifications).filter(notification => notification.recipient === userId);
    }

    async update(entity: Notification, id: string): Promise<Notification> {
        if (!this.notifications[id]) {
            throw new Error(`Notification with ID ${id} does not exist.`);
        }
        this.notifications[id] = entity;
        return entity;
    }
}
