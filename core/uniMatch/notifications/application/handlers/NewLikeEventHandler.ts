import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IAppNotifications } from "../ports/IAppNotifications";

export class NewLikeEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
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
                true
            );
    
            this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "new-like";
    }
}
