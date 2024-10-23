import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IAppNotifications } from "../ports/IAppNotifications";
import { Notification } from "../../domain/Notification";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";

export class DeletedMessageEventHandler implements IEventHandler {
    private readonly appNotifications: IAppNotifications;
    private readonly repository: INotificationsRepository;

    constructor(appNotifications: IAppNotifications, repository: INotificationsRepository) {
        this.appNotifications = appNotifications;
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const messageId = event.getPayload().get("messageId");
            const recipient = event.getAggregateId();
            const sender = event.getPayload().get("sender");
    
            if (!messageId || !recipient) {
                throw new ErrorEvent("Recipient and MessageID is required to delete a message.");
            }

            if (!sender) {
                throw new ErrorEvent("Sender is required to delete a message.");
            }

            const oldNotification = await this.repository.findByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);

            if (oldNotification) {
                await this.repository.deleteById(oldNotification.getId());
            }
     
            const notification = Notification.createMessageNotification(
                messageId,
                new Date(),
                recipient,
                "Message deleted",
                sender,
                undefined,
                undefined,
                MessageStatusEnum.DELETED_FOR_BOTH
            );

            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "deleted-message";
    }
}
