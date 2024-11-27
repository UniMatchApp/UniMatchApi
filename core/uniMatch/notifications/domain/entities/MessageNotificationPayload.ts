import {NotificationPayload} from "../NotificationPayload";
import {
    MessageContentStatusType,
    MessageDeletedStatusType,
    MessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";

export class MessageNotificationPayload extends NotificationPayload {
    private _content: string;
    private _sender: string;
    private _attachment?: string;
    private _receptionStatus: MessageReceptionStatusType;
    private _contentStatus: MessageContentStatusType;
    private _deletedStatus: MessageDeletedStatusType;

    constructor(id: string, content: string, sender: string, contentStatus: MessageContentStatusType, receptionStatus: MessageReceptionStatusType, deletedStatus: MessageDeletedStatusType, attachment?: string) {
        super(id);
        this._content = content;
        this._sender = sender;
        this._attachment = attachment;
        this._contentStatus = contentStatus;
        this._receptionStatus = receptionStatus;
        this._deletedStatus = deletedStatus;
    }


    get contentStatus(): MessageContentStatusType {
        return this._contentStatus;
    }

    set contentStatus(value: MessageContentStatusType) {
        this._contentStatus = value;
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

    public get receptionStatus(): MessageReceptionStatusType {
        return this._receptionStatus;
    }

    public set receptionStatus(status: MessageReceptionStatusType) {
        this._receptionStatus = status;
    }

    public get deletedStatus(): MessageDeletedStatusType {
        return this._deletedStatus;
    }

    public set deletedStatus(deletedStatus: MessageDeletedStatusType) {
        this._deletedStatus = deletedStatus;
    }
}
