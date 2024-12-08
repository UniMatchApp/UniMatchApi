import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import { MessageContentStatusEnum, MessageDeletedStatusEnum, MessageReceptionStatusEnum } from "@/core/shared/domain/MessageReceptionStatusEnum";

export class EditedMessageEvent extends DomainEvent {
    constructor(
        aggregateId: string, 
        newContent: string, 
        sender: string,
        recipient: string,
        contentStatus: MessageContentStatusEnum,
        receptionStatus: MessageReceptionStatusEnum,
        deletedStatus: MessageDeletedStatusEnum,
        attachment?: string
    ) {
        super(aggregateId, "edited-message");
        this.getPayload().set("newContent", newContent);
        this.getPayload().set("sender", sender);
        this.getPayload().set("recipient", recipient);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
        this.getPayload().set("contentStatus", contentStatus);
        this.getPayload().set("receptionStatus", receptionStatus);
        this.getPayload().set("deletedStatus", deletedStatus);
    }

    public static from(message: Message): EditedMessageEvent {
        return new EditedMessageEvent(
            message.getId().toString(),
            message.content,
            message.sender,
            message.recipient,
            message.contentStatus as MessageContentStatusEnum,
            message.receptionStatus as MessageReceptionStatusEnum,
            message.deletedStatus as MessageDeletedStatusEnum,
            message.attachment
        );
    }
}
