import { NotificationTypeEnum } from "../enum/NotificationTypeEnum";
import { NotificationPayload } from "../NotificationPayload";

export class AppNotificationPayload extends NotificationPayload {
    public title: string;
    public description: string;

    constructor(id: string, title: string, description: string) {
        const type = NotificationTypeEnum.APP;
        super(id, type);
        this.title = title;
        this.description = description;
    }
}
