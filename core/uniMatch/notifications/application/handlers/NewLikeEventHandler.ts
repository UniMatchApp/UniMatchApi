import { IEventHandler } from "../../../../shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class NewLikeEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const recipient = event.getAggregateId();
        const likedProfileId = event.getPayload().get("likedProfileId");

        const notification = new Notification(
            NotificationTypeEnum.APP,
            `Your profile has received a new like.`,
            new Date(),
            recipient
        );

        this.repository.save(notification);
    }

    getEventId(): string {
        return "new-like";
    }
}
