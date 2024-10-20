import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {Notification} from "../../domain/Notification";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import {EventStatusEnum} from "../../domain/enum/EventStatusEnum";
import {EventError} from "@/core/shared/exceptions/EventError";

export class EventIsDeletedEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const eventId = event.getAggregateId();
            const eventName = event.getPayload().get("title");
            const recipients = event.getPayload().get("recipients");

            if (!eventId || !eventName || !recipients) {
                throw new EventError("Event ID, name and recipients are required to delete an event.");
            }

            for (const recipient of recipients.split(",")) {
                const notification = Notification.createEventNotification(
                    eventId,
                    new Date(),
                    recipient,
                    eventName,
                    EventStatusEnum.CANCELLED
                );

                this.repository.create(notification);
                this.appNotifications.sendNotification(notification);
            }
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "event-is-deleted";
    }
}
