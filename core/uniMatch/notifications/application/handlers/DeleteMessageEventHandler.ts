import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class DeleteMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const messageId = event.getPayload().get("messageId");
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.MESSAGE,
            `A message with ID ${messageId} has been deleted.`,
            new Date(),
            recipient
        );

        this.repository.save(notification);
    }

    getEventId(): string {
        return "delete-message";
    }
}
