import { NotificationTypeEnum } from "../enum/NotificationTypeEnum";
import { NotificationPayload } from "../NotificationPayload";

export class MatchNotificationPayload extends NotificationPayload {
    private _userMatched: string;
    private _isLiked: boolean;

    constructor(id: string, userMatched: string, isLiked: boolean) {
        const type = NotificationTypeEnum.MATCH;
        super(id, type);
        this._userMatched = userMatched;
        this._isLiked = isLiked;
    }

    public get userMatched(): string {
        return this._userMatched;
    }

    public set userMatched(userMatched: string) {
        this._userMatched = userMatched;
    }

    public get isLiked(): boolean {
        return this._isLiked;
    }

    public set isLiked(isLiked: boolean) {
        this._isLiked = isLiked;
    }
}
