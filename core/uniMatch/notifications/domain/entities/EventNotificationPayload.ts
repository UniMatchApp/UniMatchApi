import { EventStatusType } from "../enum/EventStatusEnum";
import { NotificationPayload } from "../NotificationPayload";

export class EventNotificationPayload extends NotificationPayload {
    private _title: string;
    private _status: EventStatusType;

    constructor(id: string, title: string, status: EventStatusType) {
        super(id);
        this._title = title;
        this._status = status;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get status(): EventStatusType {
        return this._status;
    }

    public set status(status: EventStatusType) {
        this._status = status;
    }

}
