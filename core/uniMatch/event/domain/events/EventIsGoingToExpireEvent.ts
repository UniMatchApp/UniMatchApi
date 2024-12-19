import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Event } from "../Event"; // Asegúrate de que la ruta sea correcta

export class EventIsGoingToExpire extends DomainEvent {
    constructor(
        aggregateId: string,
        title: string,
        participants: string[],
        location: string,
    ) {
        super(aggregateId, "event-is-going-to-expire");
        this.getPayload().set("title", title);
        this.getPayload().set("participants", participants.join(", "));
        this.getPayload().set("location", location);
    }

    public static from(event: Event): EventIsGoingToExpire {
        return new EventIsGoingToExpire(
            event.getId().toString(),
            event.title,
            event.participants,
            event.location.toString()
        );
    }
}
