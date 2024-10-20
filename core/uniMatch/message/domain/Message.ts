
import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { NewMessage } from "./events/NewMessage";
import { DeletedMessage } from "./events/DeletedMessage";
import { EditedMessage } from "./events/EditedMessage";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";


export class Message extends AggregateRoot {
    private _content: string;
    private _status: string;
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
        this._content = content;
        this._timestamp = new Date();
        this._sender = sender;
        this._recipient = recipient;
        this._attachment = attachment;
        this._status = MessageStatusEnum.SENT;
        this.recordEvent(new NewMessage(
            this.getId().toString(), 
            content, 
            sender, 
            recipient,
            attachment
        ));

    }

    public get content(): string {
        return this._content;
    }

    public set content(value: string) {
        if (value.length === 0) {
            throw new DomainError("Message content cannot be empty.");
        }
        this._content = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: MessageStatusEnum) {
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

    public delete(): void {
        this.setIsActive(false);
        this.recordEvent(new DeletedMessage(this.getId().toString()));
    }

    public edit(content: string, attachment?: string): void {
        this.content = content;
        this.attachment = attachment;
        this.timestamp = new Date();
        this.recordEvent(new EditedMessage(
            this.getId().toString(),
            this._content,
            this._attachment
        ));
    }
}
