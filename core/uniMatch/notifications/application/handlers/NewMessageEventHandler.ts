import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IAppNotifications } from "../ports/IAppNotifications";

export class NewMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    handle(event: DomainEvent): void {
        const sender = event.getPayload().get("sender");
        const thumbnail = event.getPayload().get("attachment");
        const content = event.getPayload().get("content");
        const recipient = event.getPayload().get("recipient");
        const id = event.getAggregateId();

        if (!sender || !recipient) {
            throw new Error("Recipient and Sender are required to create a notification.");
        }

        if (!content) {
            throw new Error("Content is required to create a notification.");
        }

        const notification = Notification.createMessageNotification(
            id,
            new Date(),
            recipient,
            content,
            sender,
            thumbnail
        );

        this.repository.save(notification);
        this.appNotifications.sendNotification(notification);
    }

    getEventId(): string {
        return "new-message";
    }
}