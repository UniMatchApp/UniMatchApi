import { Location } from '@/core/shared/domain/Location';
import { EventEntity } from '../models/EventEntity';
import { Event } from "../../../domain/Event";

export class EventMapper {
  static toDomain(entity: EventEntity): Event {
    const location = new Location(entity.latitude, entity.longitude, entity.altitude);
    const event = new Event(
      entity.title,
      location,
      entity.date,
      entity.ownerId,
      entity.participants,
      entity.likes,
      entity.price,
      entity.thumbnail
    );
    event.setId(entity.id);
    return event;
  }

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
    entity.thumbnail = event.thumbnail;
    return entity;
  }
}
