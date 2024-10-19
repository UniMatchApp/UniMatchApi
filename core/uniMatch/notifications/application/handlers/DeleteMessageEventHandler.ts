import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IAppNotifications } from "../ports/IAppNotifications";
import { DomainError } from "@/core/shared/domain/DomainError";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";

export class DeleteMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        const messageId = event.getPayload().get("messageId");
        const recipient = event.getAggregateId();

        if (!messageId || !recipient) {
            throw new DomainError("Recipient and MessageID is required to delete a message.");
        }

        const notification = await this.repository.findByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);


        await this.appNotifications.cancelNotification(notification[0]);
        this.repository.deleteById(notification[0].getId());
    }

    getEventId(): string {
        return "delete-message";
    }
}
