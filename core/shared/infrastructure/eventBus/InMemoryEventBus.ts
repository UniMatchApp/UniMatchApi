import { IEventBus } from "../../application/IEventBus";
import { IEventHandler } from "../../application/IEventHandler";
import { DomainEvent } from "../../domain/DomainEvent";

export class InMemoryEventBus implements IEventBus {
    private readonly handlers: Map<string, IEventHandler[]> = new Map();

    publish(events: DomainEvent[]): void {
        for (const event of events) {
            const eventHandlers = this.handlers.get(event.getEventId());
            if (eventHandlers) {
                for (const handler of eventHandlers) {
                    handler.handle(event);
                }
            }
        }
    }

    subscribe(handler: IEventHandler): void {
        const eventId = handler.getEventId();
        if (!this.handlers.has(eventId)) {
            this.handlers.set(eventId, []);
        }
        this.handlers.get(eventId)?.push(handler);
    }
}
