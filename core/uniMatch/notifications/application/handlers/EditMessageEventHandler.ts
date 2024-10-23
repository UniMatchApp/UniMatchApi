import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { Notification } from "../../domain/Notification";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { NotificationTypeEnum } from "../../domain/enum/NotificationTypeEnum";


export class EditMessageEventHandler implements IEventHandler {
    private readonly appNotifications: IAppNotifications;
    private readonly repository: INotificationsRepository;

    constructor(appNotifications: IAppNotifications, repository: INotificationsRepository) {
        this.appNotifications = appNotifications;
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const messageId = event.getPayload().get("messageId");
            const newContent = event.getPayload().get("newContent");
            const recipient = event.getAggregateId();
            const sender = event.getPayload().get("sender");
            const thumbnail = event.getPayload().get("attachment");

            if (!messageId || !newContent || !recipient) {
                throw new ErrorEvent("Recipient, MessageID and new content are required to edit a message.");
            }

            if (!sender) {
                throw new ErrorEvent("Sender is required to edit a message.");
            }

            const oldNotification = await this.repository.findByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);

            if (oldNotification) {
                await this.repository.deleteById(oldNotification.getId());
            }

            const notification = Notification.createMessageNotification(
                messageId,
                new Date(),
                recipient,
                newContent,
                sender,
                MessageStatusEnum.EDITED,
                thumbnail,
                undefined
            );
            
            this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }

    }

    getEventId(): string {
        return "edit-message";
    }
}
