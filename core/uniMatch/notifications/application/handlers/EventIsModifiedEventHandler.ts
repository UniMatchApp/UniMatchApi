import { IEventHandler } from "../../../../shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class EventIsModifiedEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const eventName = event.getPayload().get("eventName");
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.EVENTS,
            `The event ${eventName} has been modified.`,
            new Date(),
            recipient
        );

        this.repository.save(notification);
    }

    getEventId(): string {
        return "event-is-modified";
    }
}
