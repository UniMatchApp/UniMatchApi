import {IEventRepository} from '../../../application/ports/IEventRepository';
import {EventEntity} from '../models/EventEntity';
import {EventMapper} from '../mappers/EventMapper';
import AppDataSource from '../Config';
import {Event} from '../../../domain/Event';
import {Repository} from "typeorm";

export class TypeORMEventRepository implements IEventRepository {
    private readonly eventRepository: Repository<EventEntity>

    constructor() {
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized for Events');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization for Events', err);
            });

        this.eventRepository = AppDataSource.getRepository(EventEntity);
    }

    async create(entity: Event): Promise<void> {
        const eventEntity = EventMapper.toEntity(entity);
        await this.eventRepository.save(eventEntity);
    }

    async findById(id: string): Promise<Event | null> {
        const entity = await this.eventRepository.findOne({where: {id}});
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
        const count = await this.eventRepository.count({where: {id}});
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
