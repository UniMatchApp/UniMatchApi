import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import {Message} from "@/core/uniMatch/message/domain/Message";

export class InMemoryMessageRepository implements IMessageRepository {
    private messages: { [id: string]: Message } = {};

    async create(entity: Message): Promise<void> {
        const id = entity.getId().toString();
        this.messages[id] = entity;
    }

    async deleteAll(): Promise<void> {
        this.messages = {};
    }

    async deleteById(id: string): Promise<void> {
        if (!this.messages[id]) {
            throw new Error(`Message with ID ${id} does not exist.`);
        }
        delete this.messages[id];
    }

    async existsById(id: string): Promise<boolean> {
        return id in this.messages;
    }

    async findAll(): Promise<Message[]> {
        return Object.values(this.messages);
    }

    async findById(id: string): Promise<Message | null> {
        return this.messages[id] || null;
    }

    async findLastMessagesBetweenUsers(userId: string, otherUserId: string): Promise<Message[]> {
        return Object.values(this.messages)
            .filter(
                message =>
                    (message.sender === userId && message.recipient === otherUserId) ||
                    (message.sender === otherUserId && message.recipient === userId)
            )
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    async findLastMessagesOfUser(userId: string): Promise<Message[]> {
        return Object.values(this.messages)
            .filter(message => message.sender === userId || message.recipient === userId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    async findMessagesBetweenUsersPaginated(userId: string, otherUserId: string, after: number, limit: number): Promise<Message[]> {
        return Object.values(this.messages)
            .filter(
                message =>
                    (message.sender === userId && message.recipient === otherUserId) ||
                    (message.sender === otherUserId && message.recipient === userId)
            )
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .slice(after, after + limit);
    }

    async update(entity: Message, id: string): Promise<Message> {
        if (!this.messages[id]) {
            throw new Error(`Message with ID ${id} does not exist.`);
        }
        this.messages[id] = entity;
        return entity;
    }
}
