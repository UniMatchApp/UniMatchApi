import { Notification } from '../../../domain/Notification';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { NotificationEntity } from '../models/NotificationEntity';
import { NotificationStatusEnumFromString } from '../../../domain/enum/NotificationStatusEnum';
import { NotificationPayload } from '../../../domain/NotificationPayload';
import { Event } from '../../../domain/entities/Event';
import { Message } from '../../../domain/entities/Message';
import { Match } from '../../../domain/entities/Match';
import { App } from '../../../domain/entities/App';
import { MapperError } from '@/core/shared/exceptions/MapperError';

export class NotificationMapper {
  static toDomain(entity: NotificationEntity): Notification {
    let payload: NotificationPayload | undefined;

    switch (entity.type) {
      case NotificationTypeEnum.EVENT:
        const eventPayload = entity.payload as Event;
        payload = new Event(entity.contentId, eventPayload.title, eventPayload.status);
        break;
      case NotificationTypeEnum.MESSAGE:
        const messagePayload = entity.payload as Message;
        payload = new Message(
          entity.contentId,
          messagePayload.content,
          messagePayload.sender,
          messagePayload.status,
          messagePayload.thumbnail,
          messagePayload.deletedStatus
        );
        break;
      case NotificationTypeEnum.MATCH:
        const matchPayload = entity.payload as Match;
        payload = new Match(entity.contentId, matchPayload.userMatched, matchPayload.isLiked);
        break;
      case NotificationTypeEnum.APP:
        const appPayload = entity.payload as App;
        payload = new App(entity.contentId, appPayload.title, appPayload.description);
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

    entity.id = notification.getId();
    entity.contentId = notification.contentId;
    entity.type = notification.type;
    entity.status = status;
    entity.date = notification.date;
    entity.recipient = notification.recipient;

    switch (notification.type) {
      case NotificationTypeEnum.EVENT:
        entity.payload = new Event(
          notification.contentId,
          (notification.payload as Event).title!,
          (notification.payload as Event).status
        );
        break;
      case NotificationTypeEnum.MESSAGE:
        const messagePayload = notification.payload as Message;
        entity.payload = new Message(
          notification.contentId,
          messagePayload.content,
          messagePayload.sender,
          messagePayload.status,
          messagePayload.thumbnail,
          messagePayload.deletedStatus
        );
        break;
      case NotificationTypeEnum.MATCH:
        const matchPayload = notification.payload as Match;
        entity.payload = new Match(
          notification.contentId,
          matchPayload.userMatched,
          matchPayload.isLiked
        );
        break;
      case NotificationTypeEnum.APP:
        const appPayload = notification.payload as App;
        entity.payload = new App(
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
