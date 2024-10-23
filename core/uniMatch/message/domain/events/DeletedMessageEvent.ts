import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import {DeletedMessageStatusType } from "@/core/shared/domain/MessageStatusEnum";

export class DeletedMessageEvent extends DomainEvent {
    private constructor(
        aggregateId: string, 
        recipient: string, 
        sender: string,
        deletedStatus: DeletedMessageStatusType
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
