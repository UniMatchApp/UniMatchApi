import { NotificationPayload } from "../NotificationPayload";
import { MessageStatusType, DeletedMessageStatusType } from "@/core/shared/domain/MessageStatusEnum";

export class Message extends NotificationPayload {
    private _content: string;
    private _sender: string;
    private _attachment?: string;
    private _status?: MessageStatusType;
    private _deletedStatus?: DeletedMessageStatusType;

    constructor(id: string, content: string, sender: string, status?: MessageStatusType, attachment?: string, deletedStatus?: DeletedMessageStatusType) {
        super(id);
        this._content = content;
        this._sender = sender;
        this._attachment = attachment;
        this._status = status;
        this._deletedStatus = deletedStatus;
    }

    public get content(): string {
        return this._content;
    }

    public set content(content: string) {
        this._content = content;
    }

    public get sender(): string {
        return this._sender;
    }

    public set sender(sender: string) {
        this._sender = sender;
    }

    public get attachment(): string | undefined {
        return this._attachment;
    }

    public set attachment(attachment: string | undefined) {
        this._attachment = attachment;
    }

    public get status(): MessageStatusType | undefined {
        return this._status;
    }

    public set status(status: MessageStatusType | undefined) {
        this._status = status;
    }

    public get deletedStatus(): DeletedMessageStatusType | undefined {
        return this._deletedStatus;
    }

    public set deletedStatus(deletedStatus: DeletedMessageStatusType | undefined) {
        this._deletedStatus = deletedStatus;
    }
}
