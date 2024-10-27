import {ISessionStatusRepository} from "@/core/uniMatch/status/application/ports/ISessionStatusRepository";
import {SessionStatus} from "@/core/uniMatch/status/domain/SessionStatus";

export class InMemorySessionStatusRepository implements ISessionStatusRepository {
    private sessions: { [userId: string]: SessionStatus } = {};

    async create(entity: SessionStatus): Promise<void> {
        const userId = entity.userId;
        this.sessions[userId] = entity;
    }

    async deleteAll(): Promise<void> {
        this.sessions = {};
    }

    async deleteById(userId: string): Promise<void> {
        if (!this.sessions[userId]) {
            throw new Error(`SessionStatus for user ID ${userId} does not exist.`);
        }
        delete this.sessions[userId];
    }

    async existsById(userId: string): Promise<boolean> {
        return userId in this.sessions;
    }

    async findAll(): Promise<SessionStatus[]> {
        return Object.values(this.sessions);
    }

    async findById(userId: string): Promise<SessionStatus | null> {
        return this.sessions[userId] || null;
    }

    async update(entity: SessionStatus, userId: string): Promise<SessionStatus> {
        if (!this.sessions[userId]) {
            throw new Error(`SessionStatus for user ID ${userId} does not exist.`);
        }
        this.sessions[userId] = entity;
        return entity;
    }
}
