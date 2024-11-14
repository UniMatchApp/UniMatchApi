import { NotificationPayload } from "./NotificationPayload";
import { NotificationTypeEnum } from "./enum/NotificationTypeEnum";
import { EventStatusType } from "./enum/EventStatusEnum";
import { NotificationStatusEnum, NotificationStatusType } from "./enum/NotificationStatusEnum";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { Message } from "./entities/Message";
import { Match } from "./entities/Match";
import { App } from "./entities/App";
import { Event } from "./entities/Event";
import { DeletedMessageStatusType, MessageStatusType } from "@/core/shared/domain/MessageStatusEnum";

export class Notification extends AggregateRoot {
    private _type: NotificationTypeEnum;
    private _status: NotificationStatusType;
    private _contentId: string;
    private _payload: NotificationPayload;
    private _date: Date;
    private _recipient: string;

    constructor(
        contentId: string,
        type: NotificationTypeEnum,
        date: Date,
        recipient: string,
        payload: NotificationPayload
    ) {
        super();
        this._contentId = contentId;
        this._type = type;
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
        const payload = new Event(contentId, title, status);
        return new Notification(contentId, NotificationTypeEnum.EVENT, date, recipient, payload);
    }

    public static createMessageNotification(
        contentId: string, 
        date: Date, 
        recipient: string, 
        content: string, 
        sender: string, 
        status?: MessageStatusType, 
        attachment?: string,
        deletedStatus?: DeletedMessageStatusType
    ): Notification {
        const payload = new Message(contentId, content, sender, status, attachment, deletedStatus);
        return new Notification(contentId, NotificationTypeEnum.MESSAGE, date, recipient, payload);
    }

    public static createMatchNotification(
        contentId: string, 
        date: Date, 
        recipient: string, 
        userMatched: string, 
        isLiked: boolean
    ): Notification {
        const payload = new Match(contentId, userMatched, isLiked);
        return new Notification(contentId, NotificationTypeEnum.MATCH, date, recipient, payload);
    }

    public static createAppNotification(
        contentId: string, 
        date: Date, 
        recipient: string, 
        title: string, 
        description: string
    ): Notification {
        const payload = new App(contentId, title, description);
        return new Notification(contentId, NotificationTypeEnum.APP, date, recipient, payload);
    }

    public get type(): NotificationTypeEnum {
        return this._type;
    }

    public set type(value: NotificationTypeEnum) {
        this._type = value;
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
