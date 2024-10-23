export type MessageStatusType = "SENT" | "READ" | "EDITED"; // En base al sender
export type DeletedMessageStatusType = "DELETED_FOR_BOTH" |"DELETED_BY_RECIPIENT" | "DELETED_BY_SENDER" | "NOT_DELETED"; // En base al sender

export enum MessageStatusEnum {
    SENT = "SENT",
    DELETED_FOR_BOTH = "DELETED_FOR_BOTH",
    DELETED_BY_RECIPIENT = "DELETED_BY_RECIPIENT",
    DELETED_BY_SENDER = "DELETED_BY_SENDER",
    NOT_DELETED = "NOT_DELETED",
    READ = "READ",
    EDITED = "EDITED"
}

