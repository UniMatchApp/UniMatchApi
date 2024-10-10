import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Message } from "../Message";

export class EditMessage extends DomainEvent {
    constructor(aggregateId: string, newContent: string, attachment?: string) {
        super(aggregateId, "edit-message");
        this.getPayload().set("newContent", newContent);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message): EditMessage {
        return new EditMessage(
            message.getId().toString(),
            message.content,
            message.attachment
        );
    }
}
