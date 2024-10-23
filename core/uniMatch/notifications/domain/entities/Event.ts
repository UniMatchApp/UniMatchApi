import { EventStatusType } from "../enum/EventStatusEnum";
import { NotificationPayload } from "../NotificationPayload";

export class Event extends NotificationPayload {
    private title: string;
    private status: EventStatusType;

    constructor(id: string, title: string, status: EventStatusType) {
        super(id);
        this.title = title;
        this.status = status;
    }

    public get getTitle(): string {
        return this.title;
    }

    public set setTitle(title: string) {
        this.title = title;
    }

    public get getStatus(): EventStatusType {
        return this.status;
    }

    public set setStatus(status: EventStatusType) {
        this.status = status;
    }
}
