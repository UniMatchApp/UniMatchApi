import { NotificationPayload } from "../NotificationPayload";

export class AppNotificationPayload extends NotificationPayload {
    private _title: string;
    private _description: string;

    constructor(id: string, title: string, description: string) {
        super(id);
        this._title = title;
        this._description = description;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description
    }
}
