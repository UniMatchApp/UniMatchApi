import {IRepository} from "@/core/shared/application/IRepository";
import { Notification } from "../../domain/Notification";
import { UUID } from "@/core/shared/domain/UUID";

export interface INotificationsRepository extends IRepository<Notification> {
    deleteAllNotificationsByRecipient(recipient: UUID): void;
    findByTypeAndTypeId(type: string, typeId: string): Notification[];
}