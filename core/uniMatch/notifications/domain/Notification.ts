import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { DomainError } from "@/core/shared/domain/DomainError";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { NotificationTypeEnum } from "./NotificationTypeEnum";

export class Notification extends AggregateRoot {
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
        this._status = MessageStatusEnum.SENT;
        this._message = message;
        this._date = date;
        this._recipient = recipient;
    }

    public get type(): string {
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

