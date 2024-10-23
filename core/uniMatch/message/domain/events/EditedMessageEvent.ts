import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Message } from "../Message";

export class EditedMessageEvent extends DomainEvent {
    constructor(aggregateId: string, newContent: string, sender: string, attachment?: string) {
        super(aggregateId, "edited-message");
        this.getPayload().set("newContent", newContent);
        this.getPayload().set("sender", sender);
        if (attachment) {
            this.getPayload().set("attachment", attachment);
        }
    }

    public static from(message: Message): EditedMessageEvent {
        return new EditedMessageEvent(
            message.getId().toString(),
            message.content,
            message.sender,
            message.attachment
        );
    }
}
