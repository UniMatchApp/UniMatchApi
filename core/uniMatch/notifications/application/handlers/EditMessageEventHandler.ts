import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import {
    MessageContentStatusEnum,
    MessageDeletedStatusEnum,
    MessageDeletedUsersType,
    MessageReceptionStatusEnum
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import { Notification } from "../../domain/Notification";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";
import { de } from "@faker-js/faker/.";


export class EditMessageEventHandler implements IEventHandler {
    private readonly appNotifications: IAppNotifications;
    private readonly repository: INotificationsRepository;

    constructor(appNotifications: IAppNotifications, repository: INotificationsRepository) {
        this.appNotifications = appNotifications;
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const messageId = event.getAggregateId();
            const newContent = event.getPayload().get("newContent");
            const recipient = event.getPayload().get("recipient");
            const sender = event.getPayload().get("sender");
            const attachment = event.getPayload().get("attachment");
            const contentStatus = event.getPayload().get("contentStatus");
            const receptionStatus = event.getPayload().get("receptionStatus");
            const deletedStatus = event.getPayload().get("deletedStatus");

            if (!messageId || !newContent || !recipient) {
                throw new ErrorEvent("Recipient, MessageID and new content are required to edit a message.");
            }

            if (!contentStatus || !receptionStatus || !deletedStatus) {
                throw new ErrorEvent("Content status, reception status and deleted status are required to edit a message.");
            }

            if (!sender) {
                throw new ErrorEvent("Sender is required to edit a message.");
            }

            const oldNotification = await this.repository.findLastNotificationByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);

            if (oldNotification) {
                await this.repository.deleteById(oldNotification.getId());
            }

            const notification = Notification.createMessageNotification(
                messageId,
                new Date(),
                recipient,
                newContent,
                sender,
                contentStatus as MessageContentStatusEnum,
                receptionStatus as MessageReceptionStatusEnum,
                deletedStatus as MessageDeletedStatusEnum,
                attachment);

            console.log("EditMessageEventHandler: ", notification);
            
            await this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            console.error(error);
        }

    }

    getEventId(): string {
        return "edited-message";
    }
}
