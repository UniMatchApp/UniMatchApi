import { DomainEvent } from '../domain/DomainEvent';

export interface IEventHandler {
    handle(event: DomainEvent): void;
    getEventId(): string;
}
