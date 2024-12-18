import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Event } from "../Event";

export class EventIsModified extends DomainEvent {
    constructor(
        aggregateId: string,
        title: string,
        location: string,
        participants: string[],
        attachment?: string
    ) {
        super(aggregateId, "event-is-modified");
        this.getPayload().set("title", title);
        this.getPayload().set("location", location);
        this.getPayload().set("participants", participants.join(","));
    }

    public static from(event: Event): EventIsModified {
        return new EventIsModified(
            event.getId().toString(),
            event.title,
            event.location.toString(),
            event.participants
        );
    }
}
