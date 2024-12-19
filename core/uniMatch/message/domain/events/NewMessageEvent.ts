import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {Message} from "../Message";
import { MessageDeletedUsersType } from "@/core/shared/domain/MessageReceptionStatusEnum";
import { Delete } from "@aws-sdk/client-s3";
import { MessageDTO } from "../../application/DTO/MessageDTO";

export class NewMessageEvent extends DomainEvent {
    constructor(aggregateId: string,
                content: string,
                sender: string,
                recipient: string,
                contentStatus: string,
                receptionStatus: string,
                deletedStatus: string,
                attachment?: string,
    ) {
        super(aggregateId, "new-message");
        this.getPayload().set("content", content);
        this.getPayload().set("sender", sender);
        this.getPayload().set("receptionStatus", receptionStatus);
        this.getPayload().set("contentStatus", contentStatus);
        this.getPayload().set("recipient", recipient);
        this.getPayload().set("deletedStatus", deletedStatus);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message, requester: string): NewMessageEvent {
        const messageDTO = MessageDTO.fromDomain(requester, message);
        return new NewMessageEvent(
            messageDTO.messageId,
            messageDTO.content,
            messageDTO.senderId,
            messageDTO.recipientId,
            messageDTO.contentStatus,
            messageDTO.receptionStatus,
            messageDTO.deletedStatus,
            messageDTO.attachment
        );
    }
}
