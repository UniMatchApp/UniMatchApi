import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {Message} from "../Message";

export class NewMessageEvent extends DomainEvent {
    constructor(aggregateId: string,
                content: string,
                sender: string,
                recipient: string,
                contentStatus: string,
                receptionStatus: string,
                deletedStatus: string,
                attachment?: string,
    ) {
        super(aggregateId, "new-message");
        this.getPayload().set("content", content);
        this.getPayload().set("sender", sender);
        this.getPayload().set("receptionStatus", receptionStatus);
        this.getPayload().set("contentStatus", contentStatus);
        this.getPayload().set("recipient", recipient);
        this.getPayload().set("deletedStatus", deletedStatus);
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
            message.contentStatus,
            message.receptionStatus,
            message.deletedStatus,
            message.attachment
        );
    }
}
