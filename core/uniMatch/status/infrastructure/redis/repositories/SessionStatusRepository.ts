import { createClient } from 'redis';
import { SessionStatus } from '../../../domain/SessionStatus';
import { IRepository } from '@/core/shared/application/IRepository';

export class SessionStatusRepository implements IRepository<SessionStatus> {
    private client: ReturnType<typeof createClient>;
    private readonly redisPrefix = 'sessionStatus:';

    constructor() {
        this.client = createClient({ url: 'redis://localhost:6379' });
        this.client.connect();
    }

    async create(entity: SessionStatus): Promise<void> {
        const key = `${this.redisPrefix}${entity.userId}`;
        await this.client.set(key, JSON.stringify(entity));
    }

    async update(entity: SessionStatus, id: string): Promise<SessionStatus> {
        const key = `${this.redisPrefix}${id}`;
        await this.client.set(key, JSON.stringify(entity));
        return entity;
    }

    async findById(id: string): Promise<SessionStatus | null> {
        const key = `${this.redisPrefix}${id}`;
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async findAll(): Promise<SessionStatus[]> {
        const keys = await this.client.keys(`${this.redisPrefix}*`);
        const sessionStatuses = await Promise.all(keys.map(key => this.findById(key.replace(this.redisPrefix, ''))));
        return sessionStatuses.filter(status => status !== null) as SessionStatus[];
    }

    async deleteById(id: string): Promise<void> {
        const key = `${this.redisPrefix}${id}`;
        await this.client.del(key);
    }

    async deleteAll(): Promise<void> {
        const keys = await this.client.keys(`${this.redisPrefix}*`);
        await Promise.all(keys.map(key => this.client.del(key)));
    }

    async existsById(id: string): Promise<boolean> {
        const key = `${this.redisPrefix}${id}`;
        const exists = await this.client.exists(key);
        return exists > 0;
    }
}
