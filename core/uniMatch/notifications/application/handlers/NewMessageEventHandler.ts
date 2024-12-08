import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {INotificationsRepository} from "../ports/INotificationsRepository";
import {Notification} from "../../domain/Notification";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IAppNotifications} from "../ports/IAppNotifications";
import {
    validateDeletedMessageStatusType,
    validateMessageContentStatusType,
    validateMessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";

export class NewMessageEventHandler implements IEventHandler {
    private readonly repository: INotificationsRepository;
    private readonly appNotifications: IAppNotifications;

    constructor(repository: INotificationsRepository, appNotifications: IAppNotifications) {
        this.repository = repository;
        this.appNotifications = appNotifications;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const sender: string | undefined = event.getPayload().get("sender");
            const content: string | undefined = event.getPayload().get("content");
            const recipient: string | undefined = event.getPayload().get("recipient");
            const contentStatus: string | undefined = event.getPayload().get("contentStatus");
            const receptionStatus: string | undefined = event.getPayload().get("receptionStatus");
            const deletedStatus: string | undefined = event.getPayload().get("deletedStatus");
            const id = event.getAggregateId();

            if (!sender || !recipient) {
                throw new ErrorEvent("Recipient and Sender are required to create a notification.");
            }

            if (!content) {
                throw new ErrorEvent("Content is required to create a notification.");
            }

            if (!receptionStatus) {
                throw new ErrorEvent("Status is required to create a notification.");
            }

            if (validateMessageReceptionStatusType(receptionStatus) === false) {
                throw new ErrorEvent("Status value is not valid : " + receptionStatus);
            }

            if (!contentStatus) {
                throw new ErrorEvent("Content status is required to create a notification.");
            }

            if (validateMessageContentStatusType(contentStatus) === false) {
                throw new ErrorEvent("Content status value is not valid : " + contentStatus);
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
                contentStatus,
                receptionStatus,
                deletedStatus);

            await this.repository.create(notification);
            this.appNotifications.sendNotification(notification);
        } catch (error: any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "new-message";
    }
}