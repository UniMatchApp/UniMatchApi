import connectToDatabase from '../Config';
import { IMessageRepository } from '../../../application/ports/IMessageRepository';
import { Message } from '../../../domain/Message';
import { MessageMapper } from '../mappers/MessageMapper';
import { IMessageEntity, MessageSchema } from '../models/MessageEntity';
import { Model } from 'mongoose';

export class MongooseMessageRepository implements IMessageRepository {
    private messageEntity: Model<IMessageEntity> | null = null;
    private ready: Promise<void>;


    constructor() {
        this.ready = this.initialize();
    }


    private async initialize() {
        try {
            const connection = await connectToDatabase();
            this.messageEntity = connection.model('Message', MessageSchema);
            console.log('MongooseMessageRepository initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Message Repository:', error);
            throw new Error('Database initialization failed');
        }
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.messageEntity) {
            await this.ready;
            if (!this.messageEntity) {
                throw new Error('Message repository is not initialized');
            }
        }
    }

    async deleteAll(): Promise<void> {
        await this.ensureInitialized();
        await this.messageEntity!.deleteMany({});
    }

    async findLastMessagesOfUser(userId: string): Promise<Message[]> {
        await this.ensureInitialized();
        const entities = await this.messageEntity!.find({ sender: userId }).sort({ timestamp: -1 });
        return entities.map(MessageMapper.toDomain);
    }

    async findLastMessagesBetweenUsers(userId: string, otherUserId: string): Promise<Message[]> {
        await this.ensureInitialized();
        const entities = await this.messageEntity!.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        }).sort({ timestamp: -1 });
        return entities.map(MessageMapper.toDomain);
    }

    async findMessagesBetweenUsersPaginated(
        userId: string,
        otherUserId: string,
        after: number,
        limit: number
    ): Promise<Message[]> {
        await this.ensureInitialized();
        const afterDate = new Date(after);
        const entities = await this.messageEntity!.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ],
            timestamp: { $gt: afterDate }
        }).sort({ timestamp: 1 }).limit(limit);
        return entities.map(MessageMapper.toDomain);
    }

    async findMessagesOfUserPaginated(userId: string, after: number, limit: number): Promise<Message[]> {
        await this.ensureInitialized();
        const entities = await this.messageEntity!.find({
            $and: [
                { $or: [{ sender: userId }, { recipient: userId }] },
                { $or: [{ createdAt: { $gt: new Date(after) } }, { updatedAt: { $gt: new Date(after) } }] }
            ]
        }).sort({ timestamp: 1 }).limit(limit);
        return entities.map(MessageMapper.toDomain);
    }

    async findById(id: string): Promise<Message | null> {
        await this.ensureInitialized();
        const entity = await this.messageEntity!.findById(id);
        return entity ? MessageMapper.toDomain(entity) : null;
    }

    async create(message: Message): Promise<void> {
        await this.ensureInitialized();
        const messageEntity = MessageMapper.toEntity(message);
        console.log('Creating message: ', messageEntity);
        await new this.messageEntity!(messageEntity).save();
    }

    async deleteById(id: string): Promise<void> {
        await this.ensureInitialized();
        await this.messageEntity!.findByIdAndDelete(id);
    }

    async update(entity: Message, id: string): Promise<Message> {
        await this.ensureInitialized();
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Message not found');
        }

        const updatedEntity = MessageMapper.toEntity(entity);
        updatedEntity.id = id;
        await this.messageEntity!.findByIdAndUpdate(id, updatedEntity, { new: true });
        return MessageMapper.toDomain(updatedEntity);
    }

    async findAll(): Promise<Message[]> {
        await this.ensureInitialized();
        const entities = await this.messageEntity!.find();
        return entities.map(MessageMapper.toDomain);
    }

    async existsById(id: string): Promise<boolean> {
        await this.ensureInitialized();
        const count = await this.messageEntity!.countDocuments({ _id: id });
        return count > 0;
    }
}
