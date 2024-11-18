import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import {Message} from "@/core/uniMatch/message/domain/Message";
import {user1, user2} from "@/core/uniMatch/user/domain/mocks/MockUsers";
import {UUID} from "@/core/shared/domain/UUID";

export class InMemoryMessageRepository implements IMessageRepository {
    private messages: { [id: string]: Message } = {
        [UUID.generate().toString()] : new Message(
            "Mock message 1",
            user1.getId().toString(),
            user2.getId().toString(),
        ),
        [UUID.generate().toString()] : new Message(
            "Mock message 2",
            user2.getId().toString(),
            user1.getId().toString(),
        ),
        [UUID.generate().toString()] : new Message(
            "Mock message 3",
            user1.getId().toString(),
            user2.getId().toString(),
        ),
        [UUID.generate().toString()] : new Message(
            "Mock message 4",
            user2.getId().toString(),
            user1.getId().toString(),
        )


    };

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

    findMessagesOfUserPaginated(userId: string, after: number, limit: number): Promise<Message[]> {
        return Promise.resolve(
            Object.values(this.messages)
                .filter(message => message.sender === userId || message.recipient === userId)
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                .slice(after, after + limit)
        );
    }

    async update(entity: Message, id: string): Promise<Message> {
        if (!this.messages[id]) {
            throw new Error(`Message with ID ${id} does not exist.`);
        }
        this.messages[id] = entity;
        return entity;
    }
}
