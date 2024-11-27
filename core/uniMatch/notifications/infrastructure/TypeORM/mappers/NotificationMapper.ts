import {Notification} from '../../../domain/Notification';
import {NotificationTypeEnum} from '../../../domain/enum/NotificationTypeEnum';
import {NotificationEntity} from '../models/NotificationEntity';
import {NotificationStatusEnumFromString} from '../../../domain/enum/NotificationStatusEnum';
import {NotificationPayload} from '../../../domain/NotificationPayload';
import {EventNotificationPayload} from '../../../domain/entities/EventNotificationPayload';
import {MessageNotificationPayload} from '../../../domain/entities/MessageNotificationPayload';
import {MatchNotificationPayload} from '../../../domain/entities/MatchNotificationPayload';
import {AppNotificationPayload} from '../../../domain/entities/AppNotificationPayload';
import {MapperError} from '@/core/shared/exceptions/MapperError';

export class NotificationMapper {
    static toDomain(entity: NotificationEntity): Notification {
        let payload: NotificationPayload | undefined;

        switch (entity.type) {
            case NotificationTypeEnum.EVENT:
                const eventPayload = entity.payload as EventNotificationPayload;
                payload = new EventNotificationPayload(entity.contentId, eventPayload.title, eventPayload.status);
                break;
            case NotificationTypeEnum.MESSAGE:
                const messagePayload = entity.payload as MessageNotificationPayload;
                payload = new MessageNotificationPayload(entity.contentId, messagePayload.content, messagePayload.sender, messagePayload.contentStatus, messagePayload.receptionStatus, messagePayload.deletedStatus, messagePayload.attachment);
                break;
            case NotificationTypeEnum.MATCH:
                const matchPayload = entity.payload as MatchNotificationPayload;
                payload = new MatchNotificationPayload(entity.contentId, matchPayload.userMatched, matchPayload.isLiked);
                break;
            case NotificationTypeEnum.APP:
                const appPayload = entity.payload as AppNotificationPayload;
                payload = new AppNotificationPayload(entity.contentId, appPayload.title, appPayload.description);
                break;
        }

        if (!payload) {
            throw new MapperError('Unknown notification type');
        }

        return new Notification(
            entity.contentId,
            entity.type,
            entity.date,
            entity.recipient,
            payload
        );
    }

    static toEntity(notification: Notification): NotificationEntity {
        const entity = new NotificationEntity();
        const status = NotificationStatusEnumFromString(notification.status);

        entity.id = notification.getId()
        entity.contentId = notification.contentId;
        entity.type = notification.type;
        entity.status = status;
        entity.date = notification.date;
        entity.recipient = notification.recipient;

        switch (notification.type) {
            case NotificationTypeEnum.EVENT:
                entity.payload = new EventNotificationPayload(
                    notification.contentId,
                    (notification.payload as EventNotificationPayload).title!,
                    (notification.payload as EventNotificationPayload).status
                );
                break;
            case NotificationTypeEnum.MESSAGE:
                const messagePayload = notification.payload as MessageNotificationPayload;
                entity.payload = new MessageNotificationPayload(notification.contentId, messagePayload.content, messagePayload.sender, messagePayload.contentStatus, messagePayload.receptionStatus, messagePayload.deletedStatus, messagePayload.attachment);
                break;
            case NotificationTypeEnum.MATCH:
                const matchPayload = notification.payload as MatchNotificationPayload;
                entity.payload = new MatchNotificationPayload(
                    notification.contentId,
                    matchPayload.userMatched,
                    matchPayload.isLiked
                );
                break;
            case NotificationTypeEnum.APP:
                const appPayload = notification.payload as AppNotificationPayload;
                entity.payload = new AppNotificationPayload(
                    notification.contentId,
                    appPayload.title,
                    appPayload.description
                );
                break;
            default:
                throw new Error('Unknown notification type');
        }

        return entity;
    }
}
