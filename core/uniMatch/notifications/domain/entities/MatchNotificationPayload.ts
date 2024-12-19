import { NotificationTypeEnum } from "../enum/NotificationTypeEnum";
import { NotificationPayload } from "../NotificationPayload";

export class MatchNotificationPayload extends NotificationPayload {
    public userMatched: string;
    public isLiked: boolean;

    constructor(id: string, userMatched: string, isLiked: boolean) {
        const type = NotificationTypeEnum.MATCH;
        super(id, type);
        this.userMatched = userMatched;
        this.isLiked = isLiked;
    }
}
