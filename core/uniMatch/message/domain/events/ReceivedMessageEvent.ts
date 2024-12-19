import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import { MessageContentStatusEnum, MessageDeletedStatusEnum, MessageReceptionStatusEnum } from "@/core/shared/domain/MessageReceptionStatusEnum";
import { MessageDTO } from "../../application/DTO/MessageDTO";

export class ReceivedMessageEvent extends DomainEvent {
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
        super(aggregateId, "read-message");
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

    public static from(message: Message, requester: string): ReceivedMessageEvent {
        const messageDTO = MessageDTO.fromDomain(requester, message);
        return new ReceivedMessageEvent(
            messageDTO.messageId,
            messageDTO.content,
            messageDTO.senderId,
            messageDTO.recipientId,
            messageDTO.contentStatus as MessageContentStatusEnum,
            messageDTO.receptionStatus as MessageReceptionStatusEnum,
            messageDTO.deletedStatus as MessageDeletedStatusEnum,
            messageDTO.attachment
        );
    }
}
