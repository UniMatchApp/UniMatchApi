import { NotificationTypeEnum } from "../enum/NotificationTypeEnum";
import {NotificationPayload} from "../NotificationPayload";
import {
    MessageContentStatusType,
    MessageDeletedStatusEnum,
    MessageDeletedStatusType,
    MessageDeletedUsersType,
    MessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";

export class MessageNotificationPayload extends NotificationPayload {
    public content: string;
    public sender: string;
    public createdAt: number;
    public updatedAt: number;
    public attachment?: string;
    public receptionStatus: MessageReceptionStatusType;
    public contentStatus: MessageContentStatusType;
    public deletedStatus: MessageDeletedStatusType

    constructor(
        id: string,
        content: string, 
        sender: string,
        createdAt: number,
        updatedAt: number,
        contentStatus: MessageContentStatusType, 
        receptionStatus: MessageReceptionStatusType, 
        deletedStatus: MessageDeletedStatusType,
        attachment?: string
    ) {
        const type = NotificationTypeEnum.MESSAGE;
        super(id, type);
        this.content = content;
        this.sender = sender;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.attachment = attachment;
        this.contentStatus = contentStatus;
        this.receptionStatus = receptionStatus;
        this.deletedStatus = deletedStatus;
    }
}
