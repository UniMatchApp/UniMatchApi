import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import {Message} from "@/core/uniMatch/message/domain/Message";
import {user1, user2} from "@/core/uniMatch/user/domain/mocks/MockUsers";
import { MessageDeletedStatusEnum } from "@/core/shared/domain/MessageReceptionStatusEnum";

export class InMemoryMessageRepository implements IMessageRepository {

    private messages: { [id: string]: Message } = {};

    constructor() {
        const _list_of_messages: Message[] = [
            new Message(
                "Mock message 1",
                user1.getId().toString(),
                user2.getId().toString(),
            ),
            new Message(
                "Mock message 2",
                user2.getId().toString(),
                user1.getId().toString(),
            ),
            new Message(
                "Mock message 3",
                user1.getId().toString(),
                user2.getId().toString(),
            ),
            new Message(
                "Mock message 4",
                user2.getId().toString(),
                user1.getId().toString(),
            )
        ];

        _list_of_messages[0].setId("10f577ad-9efa-4365-9015-94f7da265701");
        _list_of_messages[1].setId("20f577ad-9efa-4365-9015-94f7da265702");
        _list_of_messages[2].setId("30f577ad-9efa-4365-9015-94f7da265703");
        _list_of_messages[3].setId("40f577ad-9efa-4365-9015-94f7da265704");

        _list_of_messages.forEach(message => {
            this.messages[message.getId().toString()] = message;
        });

        console.log("InMemoryMessageRepository created with messages: ", this.messages);
    }

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
            .filter(message =>
                ((message.sender === userId && message.recipient === otherUserId && message.deletedStatus.sender !== MessageDeletedStatusEnum.DELETED) ||
                (message.sender === otherUserId && message.recipient === userId && message.deletedStatus.recipient !== MessageDeletedStatusEnum.DELETED))
            )
            .sort((a, b) => {
                const latestA = a.updatedAt.getTime() > a.createdAt.getTime() ? a.updatedAt : a.createdAt;
                const latestB = b.updatedAt.getTime() > b.createdAt.getTime() ? b.updatedAt : b.createdAt;
                return latestB.getTime() - latestA.getTime();
            });
    }
      
    async findLastMessagesOfUser(userId: string): Promise<Message[]> {
        return Object.values(this.messages)
            .filter(message =>
                (message.sender === userId && message.deletedStatus.sender !== MessageDeletedStatusEnum.DELETED) ||
                (message.recipient === userId && message.deletedStatus.recipient !== MessageDeletedStatusEnum.DELETED)
            )
            .sort((a, b) => {
                const latestA = a.updatedAt.getTime() > a.createdAt.getTime() ? a.updatedAt : a.createdAt;
                const latestB = b.updatedAt.getTime() > b.createdAt.getTime() ? b.updatedAt : b.createdAt;
                return latestB.getTime() - latestA.getTime();
            });
    }

    async findMessagesBetweenUsersPaginated(userId: string, otherUserId: string, after: number, limit: number): Promise<Message[]> {
        return Object.values(this.messages)
            .filter(message =>
                ((message.sender === userId && message.recipient === otherUserId && message.deletedStatus.sender !== MessageDeletedStatusEnum.DELETED) ||
                (message.sender === otherUserId && message.recipient === userId && message.deletedStatus.recipient !== MessageDeletedStatusEnum.DELETED))
            )
            .sort((a, b) => {
                const latestA = a.updatedAt.getTime() > a.createdAt.getTime() ? a.updatedAt : a.createdAt;
                const latestB = b.updatedAt.getTime() > b.createdAt.getTime() ? b.updatedAt : b.createdAt;
                return latestA.getTime() - latestB.getTime();
            })
            .slice(after, after + limit);
    }    

    findMessagesOfUserPaginated(userId: string, after: number, limit: number): Promise<Message[]> {
        return Promise.resolve(
            Object.values(this.messages)
                .filter(message =>
                    (message.sender === userId && message.deletedStatus.sender !== MessageDeletedStatusEnum.DELETED) ||
                    (message.recipient === userId && message.deletedStatus.recipient !== MessageDeletedStatusEnum.DELETED)
                )
                .sort((a, b) => {
                    const latestA = a.updatedAt.getTime() > a.createdAt.getTime() ? a.updatedAt : a.createdAt;
                    const latestB = b.updatedAt.getTime() > b.createdAt.getTime() ? b.updatedAt : b.createdAt;
                    return latestA.getTime() - latestB.getTime();
                })
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
