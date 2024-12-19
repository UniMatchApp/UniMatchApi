import { DomainEvent } from './DomainEvent';
import { Entity } from './Entity';

export class AggregateRoot extends Entity {
    private events: DomainEvent[] = [];

    public pullDomainEvents(): DomainEvent[] {
        const events = this.events;
        this.events = [];
        return events;
    }

    public recordEvent(event: DomainEvent): void {
        this.events.push(event);
    }

    public clearEvents(): void {
        this.events = [];
    }
}
