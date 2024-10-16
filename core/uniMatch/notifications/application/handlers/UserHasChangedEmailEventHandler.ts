import { IEventHandler } from "../../../../shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Notification } from "../../domain/Notification";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { NotificationTypeEnum } from "../../domain/NotificationTypeEnum";

export class UserHasChangedEmailEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const email = event.getPayload().get("email");
        const recipient = event.getAggregateId();

        const notification = new Notification(
            NotificationTypeEnum.APP,
            `The user's email has been changed to ${email}`,
            new Date(),
            recipient
        );

        //TODO: Send notification to recipient via EMAIL

        this.repository.save(notification);
    }

    getEventId(): string {
        return "user-has-changed-email";
    }
}
