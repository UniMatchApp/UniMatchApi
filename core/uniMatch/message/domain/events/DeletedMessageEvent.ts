import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import {MessageDeletedStatusType } from "@/core/shared/domain/MessageReceptionStatusEnum";
import { MessageDTO } from "../../application/DTO/MessageDTO";
import { r } from "@faker-js/faker/dist/airline-BLb3y-7w";

export class DeletedMessageEvent extends DomainEvent {
    private constructor(
        aggregateId: string, 
        recipient: string, 
        sender: string,
        deletedStatus: string
    ) {
        super(aggregateId, "deleted-message");
        this.getPayload().set("recipient", recipient);
        this.getPayload().set("sender", sender);
        this.getPayload().set("deletedStatus", deletedStatus);
    }

    public static from(message: Message, requester: string): DeletedMessageEvent {
        const messageDTO = MessageDTO.fromDomain(requester, message);
        return new DeletedMessageEvent(
            messageDTO.messageId,
            messageDTO.recipientId,
            messageDTO.senderId,
            messageDTO.deletedStatus
        );
    }
}
