import { NotificationPayload } from "../../domain/NotificationPayload";

export interface NotificationDTO {
    id: string;
    status: string;
    date: Date;
    recipient: string;
    contentId: string;
    payload: NotificationPayload;
}