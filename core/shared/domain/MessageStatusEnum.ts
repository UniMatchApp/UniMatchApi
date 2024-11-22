export type MessageStatusType = "SENT" | "READ" | "EDITED"; // En base al sender
export type DeletedMessageStatusType = "DELETED_FOR_BOTH" |"DELETED_BY_RECIPIENT" | "DELETED_BY_SENDER" | "NOT_DELETED"; // En base al sender

export function validateMessageStatusType(value: string): value is MessageStatusType {
    return value === "SENT" || value === "READ" || value === "EDITED";
}

export function validateDeletedMessageStatusType(value: string): value is DeletedMessageStatusType {
    return value === "DELETED_FOR_BOTH" || value === "DELETED_BY_RECIPIENT" || value === "DELETED_BY_SENDER" || value === "NOT_DELETED";
}


export enum MessageStatusEnum {
    SENT = "SENT",
    DELETED_FOR_BOTH = "DELETED_FOR_BOTH",
    DELETED_BY_RECIPIENT = "DELETED_BY_RECIPIENT",
    DELETED_BY_SENDER = "DELETED_BY_SENDER",
    NOT_DELETED = "NOT_DELETED",
    READ = "READ",
    EDITED = "EDITED"
}

