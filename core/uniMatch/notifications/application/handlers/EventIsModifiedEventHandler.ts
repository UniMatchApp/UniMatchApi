import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { EventStatusEnum } from "../../domain/enum/EventStatusEnum";
import { IAppNotifications } from "../ports/IAppNotifications";

export class EventIsModifiedEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const eventName = event.getPayload().get("eventName");
            const recipient = event.getAggregateId();
    
            if (!eventName || !recipient) {
                throw new ErrorEvent("Recipient and Event Name are required to create a notification.");
            }
    
            const notification = Notification.createEventNotification(
                event.getAggregateId(),
                new Date(),
                recipient,
                eventName,
                EventStatusEnum.MODIFIED
            );
            
            this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "event-is-modified";
    }
}
