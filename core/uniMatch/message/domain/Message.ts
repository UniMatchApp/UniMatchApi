
import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { DeletedMessageEvent } from "./events/DeletedMessageEvent";
import { MessageStatusType, MessageStatusEnum, DeletedMessageStatusType } from "@/core/shared/domain/MessageStatusEnum";
import { EditedMessageEvent } from "./events/EditedMessageEvent";
import { NewMessageEvent } from "./events/NewMessageEvent";


export class Message extends AggregateRoot {
    private _content: string = "";
    private _status: MessageStatusType;
    private _deletedStatus: DeletedMessageStatusType;
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
        this._status = MessageStatusEnum.SENT;
        this._deletedStatus = MessageStatusEnum.NOT_DELETED;
    }

    public get content(): string {
        return this._content;
    }

    public set content(value: string) {
        if (value.trim().length === 0 && !this._attachment) {
            throw new DomainError("Message content cannot be empty.");
        }
        this._content = value;
    }    

    public get status(): string {
        return this._status;
    }

    public set status(value: MessageStatusType) {
        this._status = value;
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

    get deletedStatus(): DeletedMessageStatusType {
        return this._deletedStatus;
    }

    set deletedStatus(value: DeletedMessageStatusType) {
        this._deletedStatus = value;
    }

    public deleteForBoth(): void {
        this._deletedStatus = MessageStatusEnum.DELETED_FOR_BOTH;
        this.setIsActive(false);
        this.recordEvent(DeletedMessageEvent.from(this));
    }

    public deleteBySender(): void {
        this._deletedStatus = MessageStatusEnum.DELETED_BY_SENDER;
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public deleteByRecipient(): void {
        this._deletedStatus = MessageStatusEnum.DELETED_BY_RECIPIENT;
        this.setIsActive(false);
        // this.recordEvent(DeletedMessageEvent.from(this));
    }

    public edit(content: string, attachment?: string): void {
        this.content = content;
        this.attachment = attachment;
        this.timestamp = new Date();
        this.recordEvent(EditedMessageEvent.from(this));
        this._status = MessageStatusEnum.EDITED;
    }

    public send(): void {
        this.recordEvent(NewMessageEvent.from(this));
    }
}
