
import { AggregateRoot } from "../../../shared/domain/AggregateRoot ";
import { DomainError } from "../../../shared/domain/DomainError";

export class Message extends AggregateRoot {
    private _content: string;
    private _status: string;
    private _timestamp: Date;
    private _sender: string;
    private _recipient: string;
    private _attachment?: string; // Opcional

    constructor(
        content: string,
        status: string,
        timestamp: Date,
        sender: string,
        recipient: string,
        attachment?: string
    ) {
        super();
        this._content = content;
        this._status = status;
        this._timestamp = timestamp;
        this._sender = sender;
        this._recipient = recipient;
        this._attachment = attachment;
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

    public set status(value: string) {
        const validStatuses = ['SENT', 'DELIVERED', 'READ'];
        if (!validStatuses.includes(value.toUpperCase())) {
            throw new DomainError("Invalid message status.");
        }
        this._status = value;
    }

    public get timestamp(): Date {
        return this._timestamp;
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
}