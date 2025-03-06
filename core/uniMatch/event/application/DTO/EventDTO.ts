import { SurveyDTO, SurveyMapper } from "./SurveyDTO";
import { Event } from "../../domain/Event";

export interface EventDTO {
    eventId: string;
    title: string;
    price?: number;
    location: { latitude: number; longitude: number; altitude?: number };
    date: string;
    ownerId: string;
    participants: string[];
    likes: string[];
    attachment?: string;
    surveys: SurveyDTO[];
  }
  
  export class EventMapper {
    static map(event: Event): EventDTO {
      return {
        eventId: event.getId(),
        title: event.title,
        price: event.price,
        location: {
          latitude: event.location.latitude,
          longitude: event.location.longitude,
          altitude: event.location.altitude,
        },
        date: event.date.toISOString(),
        ownerId: event.ownerId,
        participants: event.participants,
        likes: event.likes,
        attachment: event.attachment,
        surveys: event.surveys.map(survey => SurveyMapper.map(survey)),
      };
    }
  }
  