import {AggregateRoot} from "@/core/shared/domain/AggregateRoot ";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {DeletedMessageEvent} from "./events/DeletedMessageEvent";
import {
    MessageContentStatusEnum, MessageDeletedStatusEnum,
    MessageDeletedStatusType,
    MessageDeletedUsersType,
    MessageReceptionStatusEnum,
    MessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import {EditedMessageEvent} from "./events/EditedMessageEvent";
import {NewMessageEvent} from "./events/NewMessageEvent";


export class Message extends AggregateRoot {
    private _content: string = "";
    private _contentStatus: MessageContentStatusEnum;
    private _receptionStatus: MessageReceptionStatusType;
    private _deletedStatus: MessageDeletedUsersType;
    private _createdAt: Date;
    private _updatedAt: Date;
    private readonly _sender: string;
    private readonly _recipient: string;
    private _attachment?: string;


    constructor(
        content: string,
        sender: string,
        recipient: string,
        attachment?: string
    ) {
        super();
        this.content = content;
        this._createdAt = new Date();
        this._updatedAt = new Date();
        this.attachment = attachment;
        this._sender = sender;
        this._recipient = recipient;
        this._contentStatus = MessageContentStatusEnum.NOT_EDITED;
        this._receptionStatus = MessageReceptionStatusEnum.SENT;
        this._deletedStatus = {
            sender: MessageDeletedStatusEnum.NOT_DELETED,
            recipient: MessageDeletedStatusEnum.NOT_DELETED
        } as MessageDeletedUsersType;
    }

    public get content(): string {
        return this._content;
    }

    public set content(value: string) {
        if (!value || value.trim().length === 0 && !this._attachment) {
            throw new DomainError("Message content cannot be empty.");
        }

        this._content = value;
        this.contentStatus = MessageContentStatusEnum.EDITED;
    }

    public get receptionStatus(): string {
        return this._receptionStatus;
    }

    public set receptionStatus(value: MessageReceptionStatusType) {
        this._receptionStatus = value;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public set createdAt(value: Date) {
        this._createdAt = value;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    public get sender(): string {
        return this._sender;
    }

    public get recipient(): string {
        return this._recipient;
    }

    public get attachment(): string | undefined {
        return this._attachment;
    }

    public set attachment(value: string | undefined) {
        this._attachment = value;
    }

    get deletedStatus(): MessageDeletedUsersType {
        return this._deletedStatus;
    }

    set deletedStatus(value: MessageDeletedUsersType) {
        this._deletedStatus = value;
    }

    get contentStatus(): MessageContentStatusEnum {
        return this._contentStatus;
    }

    set contentStatus(value: MessageContentStatusEnum) {
        this._contentStatus = value;
    }

    public deleteForBoth(requester: string): void {
        this._deletedStatus = {
            sender: MessageDeletedStatusEnum.DELETED,
            recipient: MessageDeletedStatusEnum.DELETED
        }
        this.setIsActive(false);
        this.updatedAt = new Date();
        this.recordEvent(DeletedMessageEvent.from(this, requester));
    }

    public deleteForSender(requester: string): void {
        this._deletedStatus = {
            ...this._deletedStatus,
            sender: MessageDeletedStatusEnum.DELETED
        }
        this.updatedAt = new Date();
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public deleteForRecipient(requester: string): void {
        this._deletedStatus = {
            ...this._deletedStatus,
            recipient: MessageDeletedStatusEnum.DELETED
        }
        this.updatedAt = new Date();
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public edit(requester: string, content?: string, receptionStatus?: MessageReceptionStatusType): void {
        if (content) this.content = content;
        if (receptionStatus) this.receptionStatus = receptionStatus;
        this.updatedAt = new Date();
        this.recordEvent(EditedMessageEvent.from(this, requester));
    }

    public read(requester: string): void {
        this.receptionStatus = MessageReceptionStatusEnum.READ
        this.recordEvent(EditedMessageEvent.from(this, requester));
    }

    public received(requester: string): void {
        this.receptionStatus = MessageReceptionStatusEnum.RECEIVED
        this.recordEvent(EditedMessageEvent.from(this, requester));
    }

    public send(requester: string): void {
        this.recordEvent(NewMessageEvent.from(this, requester));
    }
}
