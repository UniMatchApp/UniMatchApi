import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";

export class UserHasChangedPasswordEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly emailNotifications: IEmailNotifications;

    constructor(repository: INotificationsRepository, emailNotifications: IEmailNotifications) {
        this.repository = repository;
        this.emailNotifications = emailNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const recipient = event.getAggregateId();

            if (!recipient) {
                throw new ErrorEvent("Recipient is required to create a notification.");
            }
    
            const notification = Notification.createAppNotification(
                event.getAggregateId(),
                new Date(),
                recipient,
                "Your password has been changed",
                "Your password has been changed"
            );
    
            this.repository.create(notification);
            this.emailNotifications.sendEmailToOne(recipient, "Your password has been changed", "Your password has been changed");
        } catch (error: any) {
            console.error("Error handling event: ", event);
        }
    }

    getEventId(): string {
        return "user-has-changed-password";
    }
}
