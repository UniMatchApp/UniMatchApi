import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import {MessageDeletedStatusType } from "@/core/shared/domain/MessageReceptionStatusEnum";

export class DeletedMessageEvent extends DomainEvent {
    private constructor(
        aggregateId: string, 
        recipient: string, 
        sender: string,
        deletedStatus: MessageDeletedStatusType
    ) {
        super(aggregateId, "deleted-message");
        this.getPayload().set("recipient", recipient);
        this.getPayload().set("sender", sender);
        this.getPayload().set("deletedStatus", deletedStatus);
    }

    public static from(message: Message): DeletedMessageEvent {
        return new DeletedMessageEvent(
            message.getId(),
            message.recipient,
            message.sender,
            message.deletedStatus
        );
    }
}
