import { Location } from '@/core/shared/domain/Location';
import { EventEntity } from '../models/EventEntity';
import { Event } from "../../../domain/Event";
import { TransformFromUndefinedToNull } from '@/core/shared/infrastructure/decorators/TransformFromUndefinedToNull';

export class EventMapper {
  static toDomain(entity: EventEntity): Event {
    const location = new Location(entity.latitude, entity.longitude, entity.altitude ?? 0);
    const event = new Event(
      entity.title,
      location,
      entity.date,
      entity.ownerId,
      entity.participants,
      entity.likes,
      entity.price ?? undefined,
      entity.attachment ?? undefined
    );
    event.setId(entity.id);
    return event;
  }

  @TransformFromUndefinedToNull
  static toEntity(event: Event): EventEntity {
    const entity = new EventEntity();
    entity.id = event.getId().toString();
    entity.title = event.title;
    entity.price = event.price;
    entity.latitude = event.location.latitude;
    entity.longitude = event.location.longitude;
    entity.altitude = event.location.altitude;
    entity.date = event.date;
    entity.ownerId = event.ownerId;
    entity.participants = event.participants;
    entity.likes = event.likes;
    entity.attachment = event.attachment;
    return entity;
  }
}
