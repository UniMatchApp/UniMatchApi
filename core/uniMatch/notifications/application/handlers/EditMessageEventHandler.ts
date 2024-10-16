import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { DomainError } from "@/core/shared/domain/DomainError";
import { IAppNotifications } from "../ports/IAppNotifications";

export class EditMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    handle(event: DomainEvent): void {
        const messageId = event.getPayload().get("messageId");
        const newContent = event.getPayload().get("newContent");
        const recipient = event.getAggregateId();

        if (!messageId || !newContent || !recipient) {
            throw new DomainError("Recipient, MessageID and new content are required to edit a message.");
        }

        const notification = this.repository.findById(messageId);
        if (!notification) {
            throw new DomainError("Notification not found.");
        }

        
        this.repository.save(notification);
        this.appNotifications.editNotification(notification);

    }

    getEventId(): string {
        return "edit-message";
    }
}
