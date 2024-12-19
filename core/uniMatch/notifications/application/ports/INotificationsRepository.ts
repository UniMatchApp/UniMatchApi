import {IRepository} from "@/core/shared/application/IRepository";
import { Notification } from "../../domain/Notification";

export interface INotificationsRepository extends IRepository<Notification> {
    deleteAllNotificationsByRecipient(recipient: string): Promise<void>;
    findByTypeAndTypeId(type: string, typeId: string): Promise<Notification[]>;
    findLastNotificationByTypeAndTypeId(type: string, typeId: string): Promise<Notification | null>;
    getAllNotifications(userId: string): Promise<Notification[]>;
}