import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";

export class UserHasChangedPasswordEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly emailNotifications: IEmailNotifications;

    constructor(repository: INotificationsRepository, emailNotifications: IEmailNotifications) {
        this.repository = repository;
        this.emailNotifications = emailNotifications;
    }

    handle(event: DomainEvent): void {
        const recipient = event.getAggregateId();

        if (!recipient) {
            throw new Error("Recipient is required to create a notification.");
        }

        const notification = Notification.createAppNotification(
            event.getAggregateId(),
            new Date(),
            recipient,
            "Your password has been changed",
            "Your password has been changed"
        );

        this.repository.save(notification);
        this.emailNotifications.sendEmailToOne(recipient, "Your password has been changed", "Your password has been changed");
    }

    getEventId(): string {
        return "user-has-changed-password";
    }
}
