import { NotificationTypeEnum } from "./enum/NotificationTypeEnum";

export abstract class NotificationPayload {
    private readonly id: string;
    readonly type: NotificationTypeEnum;

    protected constructor(id: string, type: NotificationTypeEnum) {
        this.id = id;
        this.type = type;
    }

    public get getId(): string {
        return this.id;
    }

    public get getType(): NotificationTypeEnum {
        return this.type;
    }
}