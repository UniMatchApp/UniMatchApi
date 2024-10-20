import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";
import {MessageStatusEnum} from "@/core/uniMatch/message/domain/MessageStatusEnum";

export class DeletedMessageEvent extends DomainEvent {
    private constructor(aggregateId: string, deleted_by_recipient: boolean) {
        super(aggregateId, "deleted-message");
        this.getPayload().set("deleted_by_recipient", deleted_by_recipient.toString());

    }

    public static from(message: Message): DeletedMessageEvent {
        return new DeletedMessageEvent(
            message.getId().toString(),
            message.status === MessageStatusEnum.DELETED_BY_RECIPIENT
        );
    }
}
