import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";

export class UserHasChangedEmailEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly emailNotifications: IEmailNotifications;

    constructor(repository: INotificationsRepository, emailNotifications: IEmailNotifications) {
        this.repository = repository;
        this.emailNotifications = emailNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const email = event.getPayload().get("email");
            const recipient = event.getAggregateId();
    
            if (!email || !recipient) {
                throw new ErrorEvent("Recipient and Email are required to create a notification.");
            }
    
            const notification = Notification.createAppNotification(
                event.getAggregateId(),
                new Date(),
                recipient,
                "Your email has been changed",
                "Your email has been changed to " + email
            );
    
            this.repository.save(notification);
            this.emailNotifications.sendEmailToOne(email, "Your email has been changed", "Your email has been changed to " + email);
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "user-has-changed-email";
    }
}
