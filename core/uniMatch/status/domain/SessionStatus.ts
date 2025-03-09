import { AggregateRoot } from '@/core/shared/domain/AggregateRoot ';
import { ChatStatusEnum } from './enum/ChatStatusEnum';
import { LookingForRandomEvent } from './events/LookingForRandomEvent';

export class SessionStatus extends AggregateRoot{
    private readonly _userId: string;
    private _status: string;
    private _targetUser?: string;

    constructor(
        userId: string,
        status: string,
        targetUser?: string
    ) {
        super();
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

    public startFindingRandom() {
        this.status = ChatStatusEnum.FINDING_RANDOM;
        this.recordEvent(LookingForRandomEvent.from(this.userId, ChatStatusEnum.FINDING_RANDOM));
    }

    public stopFindingRandom() {
        this.status = ChatStatusEnum.ONLINE;
        this.recordEvent(LookingForRandomEvent.from(this.userId, ChatStatusEnum.ONLINE));
    }

}
