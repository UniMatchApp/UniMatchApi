import { IEventRepository } from "@/core/uniMatch/event/application/ports/IEventRepository";
import { Event } from "@/core/uniMatch/event/domain/Event";

export class InMemoryEventRepository implements IEventRepository {
    private events: { [id: string]: Event } = {};

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
