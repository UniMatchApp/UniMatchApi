import { DomainError } from "../../../shared/domain/DomainError";
import { Entity } from "../../../shared/domain/Entity";
import { StatusEnum } from "../../../shared/domain/StatusEnum";
import { NotificationTypeEnum } from "./NotificationTypeEnum";

export class Notification extends Entity {
    private _type: string;
    private _status: string;
    private _message: string;
    private _date: Date;
    private _recipient: string;

    constructor(
        type: string,
        message: string,
        date: Date,
        recipient: string
    ) {
        super();
        this._type = type;
        this._status = StatusEnum.SENT;
        this._message = message;
        this._date = date;
        this._recipient = recipient;
    }

    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        if(NotificationTypeEnum[value.toUpperCase()] === undefined) {
            throw new DomainError("Invalid notification type.");
        }
        this._type = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        if(StatusEnum[value.toUpperCase()] === undefined) {
            throw new DomainError("Invalid status type.");
        }
        this._status = value;
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
            throw new DomainError("Message content cannot be empty.");
        }
        this._recipient = value;
    }
}

