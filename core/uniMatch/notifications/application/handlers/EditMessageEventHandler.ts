import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { Notification } from "../../domain/Notification";


export class EditMessageEventHandler implements IEventHandler {
    private readonly appNotifications: IAppNotifications;

    constructor(appNotifications: IAppNotifications) {
        this.appNotifications = appNotifications;
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

            const notification = Notification.createMessageNotification(
                messageId,
                new Date(),
                recipient,
                "Message edited",
                sender,
                MessageStatusEnum.EDITED,
                thumbnail,
                undefined
            );

            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }

    }

    getEventId(): string {
        return "edit-message";
    }
}
