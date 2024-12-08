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
import {ObjectId} from 'mongodb';

export class NotificationMapper {
    static toDomain(entity: NotificationEntity): Notification {
        let payload: NotificationPayload | undefined;

        switch (entity.payload.type) {
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
            default:
                console.log(entity.payload.getType);
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

        notification.setId(entity.entityId);
        notification.status = entity.status;
      
        return notification;
    }

    static toEntity(notification: Notification): NotificationEntity {
        const entity = new NotificationEntity();
        const status = NotificationStatusEnumFromString(notification.status);

        entity.entityId = notification.getId();
        entity.contentId = notification.contentId;
        entity.status = status;
        entity.date = notification.date;
        entity.recipient = notification.recipient;

        switch (notification.payload.getType) {
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
