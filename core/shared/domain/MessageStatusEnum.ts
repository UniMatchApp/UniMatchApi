export enum MessageStatusEnum {
    SENT = "SENT",
    DELETED = "DELETED",
    READ = "READ",
    EDITED = "EDITED"
}

export function MessageStatusEnumFactory(value: string): MessageStatusEnum {
    if (Object.values(MessageStatusEnum).includes(value as MessageStatusEnum)) {
        return value as MessageStatusEnum;
    }
    throw new Error("StatusEnumFactory() -> Invalid status value");
}