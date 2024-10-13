import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";

export class NewMessage extends DomainEvent {
    constructor(aggregateId: string, content: string, sender: string, recipient: string, attachment?: string) {
        super(aggregateId, "new-message");
        this.getPayload().set("content", content);
        this.getPayload().set("sender", sender);
        this.getPayload().set("recipient", recipient);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message): NewMessage {
        return new NewMessage(
            message.getId().toString(),
            message.content,
            message.sender,
            message.recipient,
            message.attachment
        );
    }
}
