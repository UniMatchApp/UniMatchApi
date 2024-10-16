import { IEventHandler } from "../../../../shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class UserHasChangedPasswordEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.APP,
            `The user's password has been changed.`,
            new Date(),
            recipient
        );

        //TODO: Send notification to recipient via EMAIL

        this.repository.save(notification);
    }

    getEventId(): string {
        return "user-has-changed-password";
    }
}
