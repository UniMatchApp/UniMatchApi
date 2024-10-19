import { IEventRepository } from '../../../application/ports/IEventRepository';
import { EventEntity } from '../models/EventEntity';
import { EventMapper } from '../mappers/EventMapper';
import AppDataSource from '../server';
import { Event } from '../../../domain/Event';

export class EventRepository implements IEventRepository {
    private readonly eventRepository = AppDataSource.getRepository(EventEntity);

    async save(entity: Event): Promise<void> {
        const eventEntity = EventMapper.toEntity(entity);
        await this.eventRepository.save(eventEntity);
    }

    async findById(id: string): Promise<Event | null> {
        const entity = await this.eventRepository.findOne({ where: { id } });
        return entity ? EventMapper.toDomain(entity) : null;
    }
    async findAll(): Promise<Event[]> {
        const entities = await this.eventRepository.find();
        return entities.map(EventMapper.toDomain);
    }

    async deleteById(id: string): Promise<void> {
        await this.eventRepository.delete(id);
    }

    async deleteAll(): Promise<void> {
        await this.eventRepository.clear();
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.eventRepository.count({ where: { id } });
        return count > 0;
    }

    async update(entity: Event, id: string): Promise<Event> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Event not found');
        }

        const updatedEntity = EventMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.eventRepository.save(updatedEntity);
        return EventMapper.toDomain(updatedEntity);
    }
}
