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
import { EventError } from "@/core/shared/exceptions/EventError";


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
            const createdAt = event.getPayload().get("createdAt");
            const updatedAt = event.getPayload().get("updatedAt");

            if (!messageId || !newContent || !recipient) {
                throw new EventError("Recipient, MessageID and new content are required to edit a message.");
            }

            if (!contentStatus || !receptionStatus || !deletedStatus) {
                throw new EventError("Content status, reception status and deleted status are required to edit a message.");
            }

            if (!sender) {
                throw new EventError("Sender is required to edit a message.");
            }1

            if (!createdAt || !updatedAt) {
                throw new EventError("Original message creation date and last update date are required to edit a message.");
            }

            const oldNotification = await this.repository.findLastNotificationByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);
            const notification = Notification.createMessageNotification(
                messageId,
                parseInt(createdAt, 10),
                parseInt(updatedAt, 10),
                recipient,
                newContent,
                sender,
                contentStatus as MessageContentStatusEnum,
                receptionStatus as MessageReceptionStatusEnum,
                deletedStatus as MessageDeletedStatusEnum,
                attachment
            );

            if (oldNotification) {
                await this.repository.deleteById(oldNotification.getId());
                await this.appNotifications.editPushNotification(oldNotification.getId(), notification); 
            }

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
