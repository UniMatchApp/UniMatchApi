import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {Notification} from "../../domain/Notification";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";

export class NewMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const sender = event.getPayload().get("sender");
            const thumbnail = event.getPayload().get("attachment");
            const content = event.getPayload().get("content");
            const recipient = event.getPayload().get("recipient");
            const id = event.getAggregateId();

            if (!sender || !recipient) {
                throw new ErrorEvent("Recipient and Sender are required to create a notification.");
            }

            if (!content) {
                throw new ErrorEvent("Content is required to create a notification.");
            }

            const notification = Notification.createMessageNotification(
                id,
                new Date(),
                recipient,
                content,
                sender,
                thumbnail
            );

            this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "new-message";
    }
}