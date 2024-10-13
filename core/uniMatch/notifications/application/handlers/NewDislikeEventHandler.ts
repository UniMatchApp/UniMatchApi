import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class NewDislikeEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const recipient = event.getAggregateId();
        const dislikedProfileId = event.getPayload().get("dislikedProfileId");

        const notification = new Notification(
            NotificationTypeEnum.APP,
            `Your profile has received a new dislike.`,
            new Date(),
            recipient
        );

        this.repository.save(notification);
    }

    getEventId(): string {
        return "new-dislike";
    }
}
