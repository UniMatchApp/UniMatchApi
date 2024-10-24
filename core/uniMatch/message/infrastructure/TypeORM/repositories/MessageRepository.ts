import { IMessageRepository } from '../../../application/ports/IMessageRepository';
import { Message } from '../../../domain/Message';
import { MessageMapper } from '../mappers/MessageMapper';
import { MessageEntity } from '../models/MessageEntity';
import AppDataSource from '../Config';

export class MessageRepository implements IMessageRepository {
    private readonly messageRepository = AppDataSource.getRepository(MessageEntity);

    async deleteAll(): Promise<void> {
        await this.messageRepository.clear();
    }    

    async findLastMessagesOfUser(userId: string): Promise<Message[]> {
        const entities = await this.messageRepository.find({
            where: { sender: userId },
            order: { timestamp: 'DESC' },
        });
        return entities.map(MessageMapper.toDomain);
    }

    async findLastMessagesBetweenUsers(userId: string, otherUserId: string): Promise<Message[]> {
        const entities = await this.messageRepository.find({
            where: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ],
            order: { timestamp: 'DESC' },
        });
        return entities.map(MessageMapper.toDomain);
    }

    async findMessagesBetweenUsersPaginated(userId: string, otherUserId: string, after: number, limit: number): Promise<Message[]> {
        const entities = await this.messageRepository.find({
            where: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ],
            order: { timestamp: 'DESC' },
            skip: after,
            take: limit,
        });
        return entities.map(MessageMapper.toDomain);
    }

    async findById(id: string): Promise<Message | null> {
        const entity = await this.messageRepository.findOne({ where: { id } });
        return entity ? MessageMapper.toDomain(entity) : null;
    }

    async create(message: Message): Promise<void> {
        const messageEntity = MessageMapper.toEntity(message);
        await this.messageRepository.save(messageEntity);
    }

    async deleteById(id: string): Promise<void> {
        await this.messageRepository.delete(id);
    }

    async update(entity: Message, id: string): Promise<Message> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Message not found');
        }

        const updatedEntity = MessageMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.messageRepository.save(updatedEntity);
        return MessageMapper.toDomain(updatedEntity);
    }

    async findAll(): Promise<Message[]> {
        const entities = await this.messageRepository.find();
        return entities.map(MessageMapper.toDomain);
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.messageRepository.count({ where: { id } });
        return count > 0;
    }
}
