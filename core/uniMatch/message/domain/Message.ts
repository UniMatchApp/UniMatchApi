import {AggregateRoot} from "@/core/shared/domain/AggregateRoot ";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {DeletedMessageEvent} from "./events/DeletedMessageEvent";
import {
    MessageContentStatusEnum, MessageDeletedStatusEnum,
    MessageDeletedStatusType,
    MessageReceptionStatusEnum,
    MessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import {EditedMessageEvent} from "./events/EditedMessageEvent";
import {NewMessageEvent} from "./events/NewMessageEvent";


export class Message extends AggregateRoot {
    private _content: string = "";
    private _contentStatus: MessageContentStatusEnum;
    private _receptionStatus: MessageReceptionStatusType;
    private _deletedStatus: MessageDeletedStatusType;
    private _timestamp: Date;
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
        this._timestamp = new Date();
        this.attachment = attachment;
        this._sender = sender;
        this._recipient = recipient;
        this._contentStatus = MessageContentStatusEnum.NOT_EDITED;
        this._receptionStatus = MessageReceptionStatusEnum.SENT;
        this._deletedStatus = MessageDeletedStatusEnum.NOT_DELETED;
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

    public get timestamp(): Date {
        return this._timestamp;
    }

    public set timestamp(value: Date) {
        this._timestamp = value;
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

    get deletedStatus(): MessageDeletedStatusType {
        return this._deletedStatus;
    }

    set deletedStatus(value: MessageDeletedStatusType) {
        this._deletedStatus = value;
    }

    get contentStatus(): MessageContentStatusEnum {
        return this._contentStatus;
    }

    set contentStatus(value: MessageContentStatusEnum) {
        this._contentStatus = value;
    }

    public deleteForBoth(): void {
        this._deletedStatus = MessageDeletedStatusEnum.DELETED_FOR_BOTH;
        this.setIsActive(false);
        this.recordEvent(DeletedMessageEvent.from(this));
    }

    public deleteBySender(): void {
        this._deletedStatus = MessageDeletedStatusEnum.DELETED_BY_SENDER;
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public deleteByRecipient(): void {
        this._deletedStatus = MessageDeletedStatusEnum.DELETED_BY_RECIPIENT;
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public edit(content?: string, receptionStatus?: MessageReceptionStatusType, contentStatus?: MessageContentStatusEnum, deletedStatus?: MessageDeletedStatusType): void {
        if (content) this.content = content;
        if (receptionStatus) this.receptionStatus = receptionStatus;
        if (contentStatus) this.contentStatus = contentStatus;
        if (deletedStatus) this.deletedStatus = deletedStatus;
        this.recordEvent(EditedMessageEvent.from(this));
    }

    public read(): void {
        this.receptionStatus = MessageReceptionStatusEnum.READ
        this.recordEvent(EditedMessageEvent.from(this));
    }

    public received(): void {
        this.receptionStatus = MessageReceptionStatusEnum.RECEIVED
        this.recordEvent(EditedMessageEvent.from(this));
    }

    public send(): void {
        this.recordEvent(NewMessageEvent.from(this));
    }
}
