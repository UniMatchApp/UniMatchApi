import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";

export class EditedMessage extends DomainEvent {
    constructor(aggregateId: string, newContent: string, attachment?: string) {
        super(aggregateId, "edited-message");
        this.getPayload().set("newContent", newContent);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message): EditedMessage {
        return new EditedMessage(
            message.getId().toString(),
            message.content,
            message.attachment
        );
    }
}
