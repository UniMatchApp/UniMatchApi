import { EventStatusType } from "../enum/EventStatusEnum";
import { NotificationTypeEnum } from "../enum/NotificationTypeEnum";
import { NotificationPayload } from "../NotificationPayload";

export class EventNotificationPayload extends NotificationPayload {
    public title: string;
    public status: EventStatusType;

    constructor(id: string, title: string, status: EventStatusType) {
        const type = NotificationTypeEnum.EVENT;
        super(id, type);
        this.title = title;
        this.status = status;
    }

}
