import connectToDatabase from '../Config';
import { INotificationsRepository } from '../../../application/ports/INotificationsRepository';
import { Notification } from '../../../domain/Notification';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { INotificationEntity, NotificationSchema } from '../models/NotificationEntity';
import { Model } from 'mongoose';

export class MongooseNotificationRepository implements INotificationsRepository {
    private notificationEntity: Model<INotificationEntity> | null = null;
    private ready: Promise<void>;

    constructor() {
        this.ready = this.initialize();
    }

    private async initialize() {
        try {
            const connection = await connectToDatabase();
            this.notificationEntity = connection.model('Notification', NotificationSchema);
            console.log('MongooseNotificationRepository initialized successfully');
        } catch (error) {
            console.error('Failed to initialize MongooseNotificationRepository:', error);
            throw new Error('Database initialization failed');
        }
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.notificationEntity) {
            await this.ready;
            if (!this.notificationEntity) {
                throw new Error('Notification repository is not initialized');
            }
        }
    }

    async deleteAll(): Promise<void> {
        await this.ensureInitialized();
        await this.notificationEntity!.deleteMany({});
    }

    async findAll(): Promise<Notification[]> {
        await this.ensureInitialized();
        const entities = await this.notificationEntity!.find();
        return entities.map(NotificationMapper.toDomain);
    }

    async existsById(id: string): Promise<boolean> {
        await this.ensureInitialized();
        const count = await this.notificationEntity!.countDocuments({ _id: id });
        return count > 0;
    }

    async create(notification: Notification): Promise<void> {
        await this.ensureInitialized();
        const notificationEntity = NotificationMapper.toEntity(notification);
        await new this.notificationEntity!(notificationEntity).save();
    }

    async findById(id: string): Promise<Notification | null> {
        await this.ensureInitialized();
        const entity = await this.notificationEntity!.findById({ _id: id });
        return entity ? NotificationMapper.toDomain(entity.toObject()) : null;
    }

    async deleteById(id: string): Promise<void> {
        await this.ensureInitialized();
        await this.notificationEntity!.findByIdAndDelete(id);
    }

    async update(entity: Notification, id: string): Promise<Notification> {
        await this.ensureInitialized();
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Notification not found');
        }

        const updatedEntity = NotificationMapper.toEntity(entity);
        const result = await this.notificationEntity!.findByIdAndUpdate(
            id,
            updatedEntity,
            { new: true }
        );

        if (!result) {
            throw new Error('Failed to update notification');
        }

        return NotificationMapper.toDomain(result.toObject());
    }

    async deleteAllNotificationsByRecipient(recipient: string): Promise<void> {
        await this.ensureInitialized();
        await this.notificationEntity!.deleteMany({ recipient });
    }

    async findLastNotificationByTypeAndTypeId(
        type: NotificationTypeEnum,
        typeId: string
    ): Promise<Notification | null> {
        await this.ensureInitialized();
        const entity = await this.notificationEntity!.findOne({
            contentId: typeId,
            'payload.type': type,
        }).sort({ date: -1 });

        return entity ? NotificationMapper.toDomain(entity.toObject()) : null;
    }

    async findByTypeAndTypeId(
        type: NotificationTypeEnum,
        typeId: string
    ): Promise<Notification[]> {
        await this.ensureInitialized();
        const entities = await this.notificationEntity!.find({
            contentId: typeId,
            'payload.type': type,
        });

        return entities.map(NotificationMapper.toDomain);
    }

    async getAllNotifications(userId: string): Promise<Notification[]> {
        await this.ensureInitialized();
        const entities = await this.notificationEntity!.find({ recipient: userId });
        return entities.map(NotificationMapper.toDomain);
    }
}
