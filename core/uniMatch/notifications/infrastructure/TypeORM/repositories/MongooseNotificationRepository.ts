import connectToDatabase from '../Config';
import { INotificationsRepository } from '../../../application/ports/INotificationsRepository';
import { Notification } from '../../../domain/Notification';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { INotificationEntity, NotificationSchema } from '../models/NotificationEntity';
import { Model } from 'mongoose';

export class MongooseNotificationRepository implements INotificationsRepository {

    private notificationEntity: Model<INotificationEntity> | undefined;

    constructor() {
        this.notificationEntity = undefined;
        this.initializeDatabaseConnection();
    }

    private initializeDatabaseConnection() {
        try {
            const connection = await connectToDatabase();
            this.notificationEntity = connection.model('Notification', NotificationSchema);
        } catch (error) {
            console.error('Error connecting to the database: ', error);
            throw error;
        }
    }

    async deleteAll(): Promise<void> {
        await this.notificationEntity.deleteMany({});
    }

    async findAll(): Promise<Notification[]> {
        const entities = await this.notificationEntity.find();
        return entities.map(NotificationMapper.toDomain);
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.notificationEntity.countDocuments({ _id: id });
        return count > 0;
    }

    async create(notification: Notification): Promise<void> {
        const notificationEntity = NotificationMapper.toEntity(notification);
        console.log('Creating notification: ', notificationEntity);
        await new this.notificationEntity(notificationEntity).save();
    }

    async findById(id: string): Promise<Notification | null> {
        const entity = await this.notificationEntity.findById({ _id: id });
        return entity ? NotificationMapper.toDomain(entity.toObject()) : null;
    }

    async deleteById(id: string): Promise<void> {
        await this.notificationEntity.findByIdAndDelete(id);
    }

    async update(entity: Notification, id: string): Promise<Notification> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Notification not found');
        }

        const updatedEntity = NotificationMapper.toEntity(entity);
        const result = await this.notificationEntity.findByIdAndUpdate(
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
        await this.notificationEntity.deleteMany({ recipient });
    }

    async findLastNotificationByTypeAndTypeId(
        type: NotificationTypeEnum,
        typeId: string
    ): Promise<Notification | null> {
        const entity = await this.notificationEntity.findOne({
            contentId: typeId,
            'payload.type': type,
        }).sort({ date: -1 });

        return entity ? NotificationMapper.toDomain(entity.toObject()) : null;
    }

    async findByTypeAndTypeId(
        type: NotificationTypeEnum,
        typeId: string
    ): Promise<Notification[]> {
        const entities = await this.notificationEntity.find({
            contentId: typeId,
            'payload.type': type,
        });

        return entities.map(NotificationMapper.toDomain);
    }

    async getAllNotifications(userId: string): Promise<Notification[]> {
        const entities = await this.notificationEntity.find({ recipient: userId });
        return entities.map(NotificationMapper.toDomain);
    }
}
