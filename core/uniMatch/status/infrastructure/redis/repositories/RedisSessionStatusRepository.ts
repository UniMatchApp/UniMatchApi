// SessionStatusRepository.ts
import { ne } from '@faker-js/faker/.';
import {SessionStatus} from '../../../domain/SessionStatus';
import client from '../Config';
import {ISessionStatusRepository} from "@/core/uniMatch/status/application/ports/ISessionStatusRepository";

export class RedisSessionStatusRepository implements ISessionStatusRepository {
    private readonly redisPrefix = 'sessionStatus:';


    constructor() {
        client.connect()
            .then(() => console.log('Connected to Redis'))
            .catch(err => console.error('Error connecting to Redis', err)
            );
    }


    async create(entity: SessionStatus): Promise<void> {
        const key = `${this.redisPrefix}${entity.userId}`;
        await client.set(key, JSON.stringify(entity));
    }

    async update(entity: SessionStatus, id: string): Promise<SessionStatus> {
        const key = `${this.redisPrefix}${id}`;
        await client.set(key, JSON.stringify(entity));
        return entity;
    }

    async findById(id: string): Promise<SessionStatus | null> {
        const key = `${this.redisPrefix}${id}`;
        const data = await client.get(key);
        if (!data) {
            return null;
        }
        const parsedData = JSON.parse(data);
        return new SessionStatus(parsedData._userId, parsedData._status, parsedData._targetUser);
    }

    async findAll(): Promise<SessionStatus[]> {
        const keys = await client.keys(`${this.redisPrefix}*`);
        const sessionStatuses = await Promise.all(keys.map(key => this.findById(key.replace(this.redisPrefix, ''))));
        return sessionStatuses.filter(status => status !== null) as SessionStatus[];
    }

    async deleteById(id: string): Promise<void> {
        const key = `${this.redisPrefix}${id}`;
        await client.del(key);
    }

    async deleteAll(): Promise<void> {
        const keys = await client.keys(`${this.redisPrefix}*`);
        await Promise.all(keys.map(key => client.del(key)));
    }

    async existsById(id: string): Promise<boolean> {
        const key = `${this.redisPrefix}${id}`;
        const exists = await client.exists(key);
        return exists > 0;
    }
}
