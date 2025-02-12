import { TaskDTO, TaskMapper } from "./TaskDTO";
import { Event } from "../../domain/Event";

export interface EventDTO {
    title: string;
    price?: number;
    location: { latitude: number; longitude: number; altitude?: number };
    date: string;
    ownerId: string;
    participants: string[];
    likes: string[];
    attachment?: string;
    tasks: TaskDTO[];
  }
  
  export class EventMapper {
    static map(event: Event): EventDTO {
      return {
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
        tasks: event.tasks.map(task => TaskMapper.map(task)),
      };
    }
  }
  