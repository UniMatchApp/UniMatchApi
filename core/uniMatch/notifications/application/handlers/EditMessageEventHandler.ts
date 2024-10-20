import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {IAppNotifications} from "../ports/IAppNotifications";
import {NotificationTypeEnum} from "../../domain/enum/NotificationTypeEnum";


export class EditMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const messageId = event.getPayload().get("messageId");
            const newContent = event.getPayload().get("newContent");
            const recipient = event.getAggregateId();

            if (!messageId || !newContent || !recipient) {
                throw new ErrorEvent("Recipient, MessageID and new content are required to edit a message.");
            }

            const lastNotification = await this.repository.findByTypeAndTypeId(NotificationTypeEnum.MESSAGE, messageId);
            if (!lastNotification) {
                throw new DomainError("Notification not found.");
            }
            const lastMessageNotification = lastNotification[0];
            await this.appNotifications.cancelNotification(lastMessageNotification);


            // TODO: Check if this is the correct way to edit a notification (must take into account the payload type to edit its content)

            // Create
            // this.repository.create(lastMessageNotification);
            // Might be able to substitute by editNotification method
            // this.appNotifications.sendNotification(newNotification);

        } catch (error: any) {
            throw error;
        }

    }

    getEventId(): string {
        return "edit-message";
    }
}
