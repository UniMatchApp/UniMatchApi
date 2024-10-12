import {IRepository} from "../../../../../shared/application/IRepository";
import {Notification} from "../../Notification";
import { UUID } from "../../../../../shared/domain/UUID";

export interface INotificationsRepository extends IRepository<Notification> {
    deleteAllNotificationsByRecipient(recipient: UUID): void;
}