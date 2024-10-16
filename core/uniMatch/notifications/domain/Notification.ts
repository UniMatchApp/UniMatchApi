
import { DomainError } from "@/core/shared/domain/DomainError";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { NotificationTypeEnum } from "./enum/NotificationTypeEnum";
import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { EventStatusEnum } from "./enum/EventStatusEnum";

abstract class NotificationPayload {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    public get getId(): string {
        return this.id;
    }

    public abstract edit(payloadData: any): void;  // Método abstracto para editar el payload
}




class Event extends NotificationPayload {
    private title: string;
    private status: EventStatusEnum;

    constructor(id: string, title: string, status: EventStatusEnum) {
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

    public get getStatus(): EventStatusEnum {
        return this.status;
    }

    public set setStatus(status: EventStatusEnum) {
        this.status = status
    }

    // Método específico para editar un evento
    public edit(payloadData: { title: string, status: EventStatusEnum }): void {
        this.setTitle = payloadData.title;
        this.status = payloadData.status;
    }
}

class Message extends NotificationPayload {
    private content: string;
    private sender: string;
    private thumbnail?: string;

    constructor(id: string, content: string, sender: string, thumbnail?: string) {
        super(id);
        this.content = content;
        this.sender = sender;
        this.thumbnail = thumbnail;
    }

    public get getContent(): string {
        return this.content;
    }

    public set setContent(content: string) {
        this.content = content;
    }

    public get getSender(): string {
        return this.sender;
    }

    public set setSender(sender: string) {
        this.sender = sender;
    }

    public get getThumbnail(): (string | undefined) {
        return this.thumbnail;
    }

    public set setThumbnail(thumbnail: string | undefined) {
        this.thumbnail = thumbnail;
    }

    // Método específico para editar un mensaje
    public edit(payloadData: { content: string, thumbnail?: string }): void {
        this.setContent = payloadData.content;
        this.setThumbnail = payloadData.thumbnail;
    }
}

class Match extends NotificationPayload {
    private userMatched: string;
    private isLiked: boolean;

    constructor(id: string, userMatched: string, isLiked: boolean) {
        super(id);
        this.userMatched = userMatched;
        this.isLiked = isLiked;
    }

    public get getUserMatched(): string {
        return this.userMatched;
    }

    public set setUserMatched(userMatched: string) {
        this.userMatched = userMatched;
    }

    public get getIsLiked(): boolean {
        return this.isLiked;
    }

    public set setIsLiked(isLiked: boolean) {
        this.isLiked = isLiked;
    }

    // Método específico para editar un match
    public edit(payloadData: { isLiked: boolean }): void {
        this.setIsLiked = payloadData.isLiked;
    }
}

class App extends NotificationPayload {
    private title: string;
    private description: string;

    constructor(id: string, title: string, description: string) {
        super(id);
        this.title = title;
        this.description = description;
    }

    public get getTitle(): string {
        return this.title;
    }

    public set setTitle(title: string) {
        this.title = title;
    }

    public get getDescription(): string {
        return this.description;
    }

    public set setDescription(description: string) {
        this.description = description;
    }

    // Método específico para editar una notificación de aplicación
    public edit(payloadData: { title: string, description: string }): void {
        this.setTitle = payloadData.title;
        this.setDescription = payloadData.description;
    }
}

export class Notification extends AggregateRoot {
    private _type: NotificationTypeEnum;
    private _status: string;
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
        this._status = MessageStatusEnum.SENT;
        this._date = date;
        this._recipient = recipient;
        this._payload = payload;
    }

    public static createEventNotification(contentId: string, date: Date, recipient: string, title: string, status: string): Notification {
        const statusEnum = EventStatusEnum[status.toUpperCase() as keyof typeof EventStatusEnum];
        if (!statusEnum) {
            throw new DomainError("Invalid event status.");
        }
        const payload = new Event(contentId, title, statusEnum);
        return new Notification(contentId, NotificationTypeEnum.EVENT, date, recipient, payload);
    }

    public static createMessageNotification(contentId: string, date: Date, recipient: string, content: string, sender: string, thumbnail?: string): Notification {
        const payload = new Message(contentId, content, sender, thumbnail);
        return new Notification(contentId, NotificationTypeEnum.MESSAGE, date, recipient, payload);
    }

    public static createMatchNotification(contentId: string, date: Date, recipient: string, userMatched: string, isLiked: boolean): Notification {
        const payload = new Match(contentId, userMatched, isLiked);
        return new Notification(contentId, NotificationTypeEnum.MATCH, date, recipient, payload);
    }

    public static createAppNotification(contentId: string, date: Date, recipient: string, title: string, description: string): Notification {
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

    public set status(value: MessageStatusEnum) {
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

    public editNotification(payloadData: any): void {
        this._payload.edit(payloadData);
    }
}
