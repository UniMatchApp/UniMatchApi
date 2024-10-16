import { DomainError } from "@/core/shared/domain/DomainError";
import { Entity } from "@/core/shared/domain/Entity";

class Message extends Entity {
    private _recipient: string;
    private _message: string;
    private _sender: string;

    constructor(
        recipient: string,
        message: string,
        sender: string
    ) {
        super();
        this._recipient = recipient;
        this._message = message;
        this._sender = sender;
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

    public get message(): string {
        return this._message;
    }

    public set message(value: string) {
        if (value.length === 0) {
            throw new DomainError("Message content cannot be empty.");
        }
        this._message = value;
    }

    public get sender(): string {
        return this._sender;
    }

    public set sender(value: string) {
        if (value.length === 0) {
            throw new DomainError("Sender cannot be empty.");
        }
        this._sender = value;
    }

}