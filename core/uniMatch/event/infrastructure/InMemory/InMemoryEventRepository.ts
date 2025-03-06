import { IEventRepository } from "@/core/uniMatch/event/application/ports/IEventRepository";
import { Event } from "@/core/uniMatch/event/domain/Event";
import { Location } from "@/core/shared/domain/Location";

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
                "concert.jpg"
            ),
            new Event(
                "Feria del Libro",
                new Location(34.0522, -118.2437, 5),
                new Date("2025-07-10T10:00:00"),
                "user234",
                ["user567", "user890"],
                ["user654"],
                undefined,
                "bookfair.jpg"
            ),
            new Event(
                "Maratón Ciudad",
                new Location(51.5074, -0.1278, 15),
                new Date("2025-09-20T06:30:00"),
                "user345",
                ["user678", "user901"],
                ["user321"],
                25
            ),
            new Event(
                "Torneo de Ajedrez",
                new Location(48.8566, 2.3522, 2),
                new Date("2025-08-05T14:00:00"),
                "user456",
                ["user789", "user234"],
                ["user567"],
                10,
                "chess.jpg"
            ),
            new Event(
                "Exposición de Arte",
                new Location(-33.8688, 151.2093, 8),
                new Date("2025-10-12T18:00:00"),
                "user567",
                ["user123", "user890"],
                ["user678"]
            )
        ];
        
        _list_of_events[0].setId("10f577ad-9efa-4365-9015-94f7da265701");
        _list_of_events[1].setId("20f577ad-9efa-4365-9015-94f7da265702");
        _list_of_events[2].setId("30f577ad-9efa-4365-9015-94f7da265703");
        _list_of_events[3].setId("40f577ad-9efa-4365-9015-94f7da265704");

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
