import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Event } from "../Event"; // Asegúrate de que la ruta sea correcta

export class EventIsDeleted extends DomainEvent {
    constructor(aggregateId: string, title: string, recipients: string[]) {
        super(aggregateId, "event-is-deleted");
        this.getPayload().set("title", title);
        this.getPayload().set("recipients", recipients.join(","));
    }

    public static from(event: Event): EventIsDeleted {
        return new EventIsDeleted(
            event.getId().toString(),
            event.title,
            event.participants
        );
    }
}
