export enum NotificationTypeEnum {
    MESSAGE = "MESSAGE",
    MATCH = "MATCH",
    APP = "APP",
    EVENTS = "EVENTS"
}

// Method to convert string to NotificationTypeEnum
export function NotificationTypeEnumFactory(value: string): NotificationTypeEnum {
    if (Object.values(NotificationTypeEnum).includes(value as NotificationTypeEnum)) {
        return value as NotificationTypeEnum;
    }
    throw new Error("NotificationTypeEnumFactory() -> Invalid notification type value");
}