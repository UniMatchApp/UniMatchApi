import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {Notification} from "../../domain/Notification";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import {
    DeletedMessageStatusType,
    MessageStatusType, validateDeletedMessageStatusType,
    validateMessageStatusType
} from "@/core/shared/domain/MessageStatusEnum";

export class NewMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const sender : string | undefined = event.getPayload().get("sender");
            const content: string | undefined  = event.getPayload().get("content");
            const recipient: string | undefined  = event.getPayload().get("recipient");
            const status: string | undefined = event.getPayload().get("status");
            const deletedStatus: string | undefined = event.getPayload().get("deletedStatus");
            const id = event.getAggregateId();


            if (!sender || !recipient) {
                throw new ErrorEvent("Recipient and Sender are required to create a notification.");
            }

            if (!content) {
                throw new ErrorEvent("Content is required to create a notification.");
            }

            if (!status) {
                throw new ErrorEvent("Status is required to create a notification.");
            }

            if (validateMessageStatusType(status) === false) {
                throw new ErrorEvent("Status value is not valid : " + status);
            }

            if (!deletedStatus) {
                throw new ErrorEvent("Deleted status is required to create a notification.");
            }

            if (validateDeletedMessageStatusType(deletedStatus) === false) {
                throw new ErrorEvent("Deleted status value is not valid : " + deletedStatus);
            }

            const notification = Notification.createMessageNotification(
                id,
                new Date(),
                recipient,
                content,
                sender,
                status,
                deletedStatus
            );

            this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            throw error;
        }
    }

    getEventId(): string {
        return "new-message";
    }
}