import connectToDatabase from '../Config';
import { IMessageRepository } from '../../../application/ports/IMessageRepository';
import { Message } from '../../../domain/Message';
import { MessageMapper } from '../mappers/MessageMapper';
import { MessageModel } from '../models/MessageEntity';

export class MongooseMessageRepository implements IMessageRepository {
    
    constructor() {
        // Conectar a la base de datos al inicializar el repositorio
        connectToDatabase().catch((err) => {
            console.error('Error connecting to the database: ', err);
        });
    }

    async deleteAll(): Promise<void> {
        await MessageModel.deleteMany({});
    }

    async findLastMessagesOfUser(userId: string): Promise<Message[]> {
        const entities = await MessageModel.find({ sender: userId })
            .sort({ timestamp: -1 });

        return entities.map(MessageMapper.toDomain);
    }

    async findLastMessagesBetweenUsers(userId: string, otherUserId: string): Promise<Message[]> {
        const entities = await MessageModel.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .sort({ timestamp: -1 });

        return entities.map(MessageMapper.toDomain);
    }

    async findMessagesBetweenUsersPaginated(userId: string, otherUserId: string, after: number, limit: number): Promise<Message[]> {
        const entities = await MessageModel.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .sort({ timestamp: -1 })
        .skip(after)
        .limit(limit);

        return entities.map(MessageMapper.toDomain);
    }

    async findMessagesOfUserPaginated(userId: string, after: number, limit: number): Promise<Message[]> {
        const entities = await MessageModel.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        })
        .sort({ timestamp: -1 })
        .skip(after)
        .limit(limit);

        return entities.map(MessageMapper.toDomain);
    }

    async findById(id: string): Promise<Message | null> {
        const entity = await MessageModel.findById(id);
        return entity ? MessageMapper.toDomain(entity) : null;
    }

    async create(message: Message): Promise<void> {
        const messageEntity = MessageMapper.toEntity(message);
        const messageDocument = new MessageModel(messageEntity);
        await messageDocument.save();
    }

    async deleteById(id: string): Promise<void> {
        await MessageModel.findByIdAndDelete(id);
    }

    async update(entity: Message, id: string): Promise<Message> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Message not found');
        }

        const updatedEntity = MessageMapper.toEntity(entity);
        updatedEntity.id = id;
        await MessageModel.findByIdAndUpdate(id, updatedEntity, { new: true });
        return MessageMapper.toDomain(updatedEntity);
    }

    async findAll(): Promise<Message[]> {
        const entities = await MessageModel.find();
        return entities.map(MessageMapper.toDomain);
    }

    async existsById(id: string): Promise<boolean> {
        const count = await MessageModel.countDocuments({ _id: id });
        return count > 0;
    }
}
