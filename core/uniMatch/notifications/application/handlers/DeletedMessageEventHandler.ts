import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import {Notification} from "../../domain/Notification";
import {
    MessageContentStatusEnum,
    MessageDeletedStatusEnum,
    MessageReceptionStatusEnum
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {NotificationTypeEnum} from "../../domain/enum/NotificationTypeEnum";
import { EventError } from "@/core/shared/exceptions/EventError";

export class DeletedMessageEventHandler implements IEventHandler {
    private readonly appNotifications: IAppNotifications;
    private readonly repository: INotificationsRepository;

    constructor(appNotifications: IAppNotifications, repository: INotificationsRepository) {
        this.appNotifications = appNotifications;
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const messageId = event.getAggregateId();
            const recipient = event.getPayload().get("recipient");
            const sender = event.getPayload().get("sender");

            if (!messageId || !recipient) {
                throw new EventError("Recipient and MessageID is required to delete a message.");
            }

            if (!sender) {
                throw new EventError("Sender is required to delete a message.");
            }

            const oldNotification = await this.repository.findLastNotificationByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId)

            if (oldNotification) {
                await this.repository.deleteById(oldNotification.getId());
            }

            const notification = Notification.createMessageNotification(
                messageId,
                new Date(),
                recipient,
                "Message deleted",
                sender,
                MessageContentStatusEnum.NOT_EDITED,
                MessageReceptionStatusEnum.SENT,
                MessageDeletedStatusEnum.DELETED,
                undefined);

            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "deleted-message";
    }
}
