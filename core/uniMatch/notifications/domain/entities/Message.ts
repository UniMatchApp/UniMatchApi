import { NotificationPayload } from "../NotificationPayload";
import { MessageStatusType, DeletedMessageStatusType } from "@/core/shared/domain/MessageStatusEnum";

export class Message extends NotificationPayload {
    private content: string;
    private sender: string;
    private thumbnail?: string;
    private status?: MessageStatusType;
    private deletedStatus?: DeletedMessageStatusType;

    constructor(id: string, content: string, sender: string, status?: MessageStatusType, thumbnail?: string, deletedStatus?: DeletedMessageStatusType) {
        super(id);
        this.content = content;
        this.sender = sender;
        this.status = status;
        this.thumbnail = thumbnail;
        this.deletedStatus = deletedStatus;
    }

    public get getContent(): string {
        return this.content;
    }

    public set setContent(content: string) {
        this.content = content;
    }

    public get getSender(): string {
        return this.sender;
    }

    public set setSender(sender: string) {
        this.sender = sender;
    }

    public get getThumbnail(): (string | undefined) {
        return this.thumbnail;
    }

    public set setThumbnail(thumbnail: string | undefined) {
        this.thumbnail = thumbnail;
    }

    public get getStatus(): MessageStatusType | undefined {
        return this.status;
    }

    public set setStatus(status: MessageStatusType) {
        this.status = status;
    }

    public get getDeletedStatus(): (DeletedMessageStatusType | undefined) {
        return this.deletedStatus;
    }

    public set setDeletedStatus(deletedStatus: DeletedMessageStatusType | undefined) {
        this.deletedStatus = deletedStatus;
    }
}
