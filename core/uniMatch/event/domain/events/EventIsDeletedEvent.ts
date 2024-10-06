import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Event } from "../Event"; // Asegúrate de que la ruta sea correcta

export class EventIsDeleted extends DomainEvent {
    constructor(aggregateId: string, title: string) {
        super(aggregateId, "event-is-deleted");
        this.getPayload().set("title", title);
    }

    public static from(event: Event): EventIsDeleted {
        return new EventIsDeleted(
            event.getId().toString(),
            event.title
        );
    }
}
