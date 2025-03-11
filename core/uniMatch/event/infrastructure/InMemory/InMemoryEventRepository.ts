import { IEventRepository } from "@/core/uniMatch/event/application/ports/IEventRepository";
import { Event } from "@/core/uniMatch/event/domain/Event";
import { Location } from "@/core/shared/domain/Location";
import { Survey } from "../../domain/Survey";

export class InMemoryEventRepository implements IEventRepository {
    private events: { [id: string]: Event } = {};

    constructor() {
        const _list_of_events: Event[] = [
            new Event(
                "Concierto de Rock",
                new Location(40.7128, -74.0060, 10),
                new Date("2025-06-15T20:00:00"),
                "a449400b-1716-4474-b8aa-2d0585422701",
                ["a449400b-1716-4474-b8aa-2d0585422701", "b449400b-1716-4474-b8aa-2d0585422702"],
                ["b449400b-1716-4474-b8aa-2d0585422702"],
                50,
                "concert.jpg",
                [new Survey("Duardo o Tiga?", ["Duardo", "Tiga"])]
            )

        
        ];
        
        _list_of_events[0].setId("10f577ad-9efa-4365-9015-94f7da265701");

        _list_of_events.forEach(event => {
            this.events[event.getId().toString()] = event;
        });
    }

    async create(entity: Event): Promise<void> {
        const id = entity.getId().toString();
        this.events[id] = entity;
    }

    async deleteAll(): Promise<void> {
        this.events = {};
    }

    async deleteById(id: string): Promise<void> {
        if (!this.events[id]) {
            throw new Error(`Event with ID ${id} does not exist.`);
        }
        delete this.events[id];
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.events;
    }

    async findAll(): Promise<Event[]> {
        return Object.values(this.events);
    }

    async findById(id: string): Promise<Event | null> {
        return this.events[id] || null;
    }

    async update(entity: Event, id: string): Promise<Event> {
        if (!this.events[id]) {
            throw new Error(`Event with ID ${id} does not exist.`);
        }
        this.events[id] = entity;
        return entity;
    }
}
