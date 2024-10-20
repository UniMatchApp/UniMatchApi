import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { IAppNotifications } from "../ports/IAppNotifications";
import { EventStatusEnum } from "../../domain/enum/EventStatusEnum";

export class EventIsDeletedEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    handle(event: DomainEvent): void {
        const eventId = event.getAggregateId();
        const eventName = event.getPayload().get("title");
        const recipients = event.getPayload().get("recipients");

        if (!eventId || !eventName || !recipients) {
            throw new DomainError("Event ID, name and recipients are required to delete an event.");
        }

        for (const recipient of recipients.split(",")) {
            const notification = Notification.createEventNotification(
                eventId,
                new Date(),
                recipient,
                eventName,
                EventStatusEnum.CANCELLED
            );
            
            this.repository.save(notification);
            this.appNotifications.sendNotification(notification);
        }
    }

    getEventId(): string {
        return "event-is-deleted";
    }
}
