import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";
import { IAppNotifications } from "../ports/IAppNotifications";

export class NewDislikeEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    handle(event: DomainEvent): void {
        const id = event.getAggregateId();
        const user = event.getPayload().get("user");
        const target = event.getPayload().get("target");

        if (!user || !target) {
            throw new Error("User and Target are required to create a notification.");
        }

        const notification = Notification.createMatchNotification(
            id,
            new Date(),
            user,
            target,
            false
        );

        this.repository.save(notification);
        this.appNotifications.sendNotification(notification);
        
    }

    getEventId(): string {
        return "new-dislike";
    }
}
