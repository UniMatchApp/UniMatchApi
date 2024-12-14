import { Notification } from '../../../domain/Notification';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { INotificationEntity, NotificationEntity } from '../models/NotificationEntity';
import { NotificationStatusEnumFromString } from '../../../domain/enum/NotificationStatusEnum';
import { NotificationPayload } from '../../../domain/NotificationPayload';
import { EventNotificationPayload } from '../../../domain/entities/EventNotificationPayload';
import { MessageNotificationPayload } from '../../../domain/entities/MessageNotificationPayload';
import { MatchNotificationPayload } from '../../../domain/entities/MatchNotificationPayload';
import { AppNotificationPayload } from '../../../domain/entities/AppNotificationPayload';
import { MapperError } from '@/core/shared/exceptions/MapperError';

export class NotificationMapper {
    static toDomain(entity: INotificationEntity): Notification {
        let payload: NotificationPayload | undefined;

        switch (entity.payload.type) {
            case NotificationTypeEnum.EVENT:
                const eventPayload = entity.payload as EventNotificationPayload;
                payload = new EventNotificationPayload(
                    entity.contentId,
                    eventPayload.title,
                    eventPayload.status
                );
                break;
            case NotificationTypeEnum.MESSAGE:
                const messagePayload = entity.payload as MessageNotificationPayload;
                payload = new MessageNotificationPayload(
                    entity.contentId,
                    messagePayload.content,
                    messagePayload.sender,
                    messagePayload.contentStatus,
                    messagePayload.receptionStatus,
                    messagePayload.deletedStatus,
                    messagePayload.attachment
                );
                break;
            case NotificationTypeEnum.MATCH:
                const matchPayload = entity.payload as MatchNotificationPayload;
                payload = new MatchNotificationPayload(
                    entity.contentId,
                    matchPayload.userMatched,
                    matchPayload.isLiked
                );
                break;
            case NotificationTypeEnum.APP:
                const appPayload = entity.payload as AppNotificationPayload;
                payload = new AppNotificationPayload(
                    entity.contentId,
                    appPayload.title,
                    appPayload.description
                );
                break;
            default:
                throw new MapperError('Unknown notification type');
        }

        if (!payload) {
            throw new MapperError('Unknown notification type');
        }

        const notification = new Notification(
            entity.contentId,
            entity.date,
            entity.recipient,
            payload
        );

        notification.setId(entity._id);
        notification.status = entity.status;

        return notification;
    }

    static toEntity(notification: Notification): INotificationEntity {
        const status = NotificationStatusEnumFromString(notification.status);

        const payload: NotificationPayload = (() => {
            switch (notification.payload.getType) {
                case NotificationTypeEnum.EVENT:
                    return new EventNotificationPayload(
                        notification.contentId,
                        (notification.payload as EventNotificationPayload).title!,
                        (notification.payload as EventNotificationPayload).status
                    );
                case NotificationTypeEnum.MESSAGE:
                    const messagePayload = notification.payload as MessageNotificationPayload;
                    return new MessageNotificationPayload(
                        notification.contentId,
                        messagePayload.content,
                        messagePayload.sender,
                        messagePayload.contentStatus,
                        messagePayload.receptionStatus,
                        messagePayload.deletedStatus,
                        messagePayload.attachment
                    );
                case NotificationTypeEnum.MATCH:
                    const matchPayload = notification.payload as MatchNotificationPayload;
                    return new MatchNotificationPayload(
                        notification.contentId,
                        matchPayload.userMatched,
                        matchPayload.isLiked
                    );
                case NotificationTypeEnum.APP:
                    const appPayload = notification.payload as AppNotificationPayload;
                    return new AppNotificationPayload(
                        notification.contentId,
                        appPayload.title,
                        appPayload.description
                    );
                default:
                    throw new MapperError('Unknown notification type');
            }
        })();

        return new NotificationEntity({
            _id: notification.getId(),
            status: status,
            contentId: notification.contentId,
            payload: payload,
            date: notification.date,
            recipient: notification.recipient
        });
    }
}
