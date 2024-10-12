import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Message } from "../Message";

export class DeletedMessage extends DomainEvent {
    constructor(aggregateId: string) {
        super(aggregateId, "deleted-message");
    }

    public static from(message: Message): DeletedMessage {
        return new DeletedMessage(message.getId().toString());
    }
}
