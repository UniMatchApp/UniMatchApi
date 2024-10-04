import { DomainEvent } from '../domain/DomainEvent';
import { IEventHandler } from './IEventHandler';

export interface IEventBus {
    publish(events: DomainEvent[]): void;
    subscribe(handler: IEventHandler): void;
}
