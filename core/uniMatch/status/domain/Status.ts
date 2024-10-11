import { UUID } from "../../../shared/domain/UUID";

export class Status {
    private _id: UUID;
    private _userId: string;
    private _status: string;
    private _targetUser?: string;

    constructor(
        id: UUID,
        userId: string,
        status: string,
        targetUser?: string
    ) {
        this._id = id;
        this._userId = userId;
        this._status = status;
        this._targetUser = targetUser;
    }

    public get id(): UUID {
        return this._id;
    }

    public set id(identifier: UUID) {

        this._id = identifier;
    }

    public get userId(): string {
        return this._userId;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        const validStatuses = ['TYPING', 'NONE'];
        if (!validStatuses.includes(value.toUpperCase())) {
            throw new Error("Invalid profile status. Allowed statuses: 'TYPING' or 'NONE'.");
        }
        this._status = value;
    }

    public get targetUser(): string | undefined {
        return this._targetUser;
    }

    public startTyping(targetUser?: string) {
        this.status = 'TYPING';
        this._targetUser = targetUser;
    }

    public stopTyping() {
        this.status = 'NONE';
        this._targetUser = undefined;
    }

}
