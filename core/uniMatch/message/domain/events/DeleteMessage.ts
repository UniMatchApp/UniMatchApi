import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Message } from "../Message";

export class DeleteMessage extends DomainEvent {
    constructor(aggregateId: string) {
        super(aggregateId, "delete-message");
    }

    public static from(message: Message): DeleteMessage {
        return new DeleteMessage(message.getId().toString());
    }
}
