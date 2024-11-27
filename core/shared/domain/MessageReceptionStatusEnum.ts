export type MessageContentStatusType = "NOT_EDITED" | "EDITED"; // En base al sender
export type MessageReceptionStatusType = "SENT" | "RECEIVED" | "READ" ; // En base al sender
export type MessageDeletedStatusType =
    "DELETED_FOR_BOTH"
    | "DELETED_BY_RECIPIENT"
    | "DELETED_BY_SENDER"
    | "NOT_DELETED"; // En base al sender

export function validateMessageContentStatusType(value: string | undefined): value is MessageContentStatusType {
    return value === "NOT_EDITED" || value === "EDITED";
}

export function validateMessageStatusType(value: string | undefined): value is MessageReceptionStatusType {
    return value === "SENT" || value === "RECEIVED" || value === "READ" ;
}

export function validateDeletedMessageStatusType(value: string | undefined): value is MessageDeletedStatusType {
    return value === "DELETED_FOR_BOTH" || value === "DELETED_BY_RECIPIENT" || value === "DELETED_BY_SENDER" || value === "NOT_DELETED";
}

export enum MessageDeletedStatusEnum {
    DELETED_FOR_BOTH = "DELETED_FOR_BOTH",
    DELETED_BY_RECIPIENT = "DELETED_BY_RECIPIENT",
    DELETED_BY_SENDER = "DELETED_BY_SENDER",
    NOT_DELETED = "NOT_DELETED"
}

export enum MessageContentStatusEnum {
    NOT_EDITED = "NOT_EDITED",
    EDITED = "EDITED"
}

export enum MessageReceptionStatusEnum {
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    READ = "READ",
}

