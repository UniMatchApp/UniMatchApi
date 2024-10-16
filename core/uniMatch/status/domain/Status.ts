import { ChatStatusEnum } from './enum/ChatStatusEnum';

export class Status {
    private readonly _userId: string;
    private _status: string;
    private _targetUser?: string;

    constructor(
        userId: string,
        status: string,
        targetUser?: string
    ) {
        this._userId = userId;
        this._status = status;
        this._targetUser = targetUser;
    }

    public get userId(): string {
        return this._userId;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: ChatStatusEnum) {
        this._status = value;
    }

    public get targetUser(): string | undefined {
        return this._targetUser;
    }

    public startTyping(targetUser?: string) {
        this.status = ChatStatusEnum.TYPING;
        this._targetUser = targetUser;
    }

    public stopTyping() {
        this.status = ChatStatusEnum.ONLINE;
        this._targetUser = undefined;
    }

}
