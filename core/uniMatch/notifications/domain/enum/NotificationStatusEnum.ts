export type NotificationStatusType = "READ" | "SENT"

export enum NotificationStatusEnum {
    READ = "READ",
    SENT = "SENT"
}

export function NotificationStatusEnumFromString(value: string): NotificationStatusEnum {
    switch (value) {
        case "READ":
            return NotificationStatusEnum.READ;
        case "SENT":
            return NotificationStatusEnum.SENT;
        default:
            throw new Error(`Invalid value ${value}`);
    }
}
