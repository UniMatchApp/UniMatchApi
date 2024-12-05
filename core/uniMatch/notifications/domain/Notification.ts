import {NotificationPayload} from "./NotificationPayload";
import {NotificationTypeEnum} from "./enum/NotificationTypeEnum";
import {EventStatusType} from "./enum/EventStatusEnum";
import {NotificationStatusEnum, NotificationStatusType} from "./enum/NotificationStatusEnum";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {AggregateRoot} from "@/core/shared/domain/AggregateRoot ";
import {MessageNotificationPayload} from "./entities/MessageNotificationPayload";
import {MatchNotificationPayload} from "./entities/MatchNotificationPayload";
import {AppNotificationPayload} from "./entities/AppNotificationPayload";
import {EventNotificationPayload} from "./entities/EventNotificationPayload";
import {
    MessageContentStatusType,
    MessageDeletedStatusType,
    MessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";

export class Notification extends AggregateRoot {
    private _status: NotificationStatusType;
    private _contentId: string;
    private _payload: NotificationPayload;
    private _date: Date;
    private _recipient: string;

    constructor(
        contentId: string,
        date: Date,
        recipient: string,
        payload: NotificationPayload
    ) {
        super();
        this._contentId = contentId;
        this._status = NotificationStatusEnum.SENT;
        this._date = date;
        this._recipient = recipient;
        this._payload = payload;
    }

    public static createEventNotification(
        contentId: string,
        date: Date,
        recipient: string,
        title: string,
        status: EventStatusType
    ): Notification {
        const payload = new EventNotificationPayload(contentId, title, status);
        return new Notification(contentId, date, recipient, payload);
    }

    public static createMessageNotification(
        contentId: string,
        date: Date,
        recipient: string,
        content: string,
        sender: string,
        contentStatus: MessageContentStatusType,
        receptionStatus: MessageReceptionStatusType,
        deletedStatus: MessageDeletedStatusType,
        attachment?: string,
    ): Notification {
        const payload = new MessageNotificationPayload(contentId, content, sender, contentStatus, receptionStatus, deletedStatus, attachment);
        return new Notification(contentId, date, recipient, payload);
    }

    public static createMatchNotification(
        contentId: string,
        date: Date,
        recipient: string,
        userMatched: string,
        isLiked: boolean
    ): Notification {
        const payload = new MatchNotificationPayload(contentId, userMatched, isLiked);
        return new Notification(contentId, date, recipient, payload);
    }

    public static createAppNotification(
        contentId: string,
        date: Date,
        recipient: string,
        title: string,
        description: string
    ): Notification {
        const payload = new AppNotificationPayload(contentId, title, description);
        return new Notification(contentId, date, recipient, payload);
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: NotificationStatusType) {
        this._status = value;
    }

    public get date(): Date {
        return this._date;
    }

    public set date(value: Date) {
        this._date = value;
    }

    public get recipient(): string {
        return this._recipient;
    }

    public set recipient(value: string) {
        if (value.length === 0) {
            throw new DomainError("Recipient cannot be empty.");
        }
        this._recipient = value;
    }

    public get contentId(): string {
        return this._contentId;
    }

    public set contentId(value: string) {
        this._contentId = value;
    }

    public get payload(): NotificationPayload {
        return this._payload;
    }

    public set payload(value: NotificationPayload) {
        this._payload = value;
    }
}
