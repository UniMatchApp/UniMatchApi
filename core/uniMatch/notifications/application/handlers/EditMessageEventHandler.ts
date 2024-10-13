import { IEventHandler } from "../../../../shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class EditMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const messageId = event.getPayload().get("messageId");
        const newContent = event.getPayload().get("newContent");
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.MESSAGE,
            `A message with ID ${messageId} has been edited. New content: ${newContent}`,
            new Date(),
            recipient
        );

        this.repository.save(notification);
    }

    getEventId(): string {
        return "edit-message";
    }
}
