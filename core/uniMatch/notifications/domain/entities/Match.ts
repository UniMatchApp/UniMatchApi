import { NotificationPayload } from "../NotificationPayload";

export class Match extends NotificationPayload {
    private userMatched: string;
    private isLiked: boolean;

    constructor(id: string, userMatched: string, isLiked: boolean) {
        super(id);
        this.userMatched = userMatched;
        this.isLiked = isLiked;
    }

    public get getUserMatched(): string {
        return this.userMatched;
    }

    public set setUserMatched(userMatched: string) {
        this.userMatched = userMatched;
    }

    public get getIsLiked(): boolean {
        return this.isLiked;
    }

    public set setIsLiked(isLiked: boolean) {
        this.isLiked = isLiked;
    }
}
