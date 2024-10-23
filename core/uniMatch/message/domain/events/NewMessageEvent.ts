import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";

export class NewMessageEvent extends DomainEvent {
    constructor(aggregateId: string, content: string, sender: string, recipient: string, attachment?: string) {
        super(aggregateId, "new-message");
        this.getPayload().set("content", content);
        this.getPayload().set("sender", sender);
        this.getPayload().set("recipient", recipient);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message): NewMessageEvent {
        return new NewMessageEvent(
            message.getId().toString(),
            message.content,
            message.sender,
            message.recipient,
            message.attachment
        );
    }
}
