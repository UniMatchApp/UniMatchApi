import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class EventIsGoingToExpireEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const eventName = event.getPayload().get("eventName");
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.EVENTS,
            `The event ${eventName} is going to expire soon.`,
            new Date(),
            recipient
        );
        

        this.repository.save(notification);
    }

    getEventId(): string {
        return "event-is-going-to-expire";
    }
}
