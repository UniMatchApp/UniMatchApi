import AppDataSource from '../Config';
import { Notification } from '../../../domain/Notification';
import { INotificationsRepository } from '../../../application/ports/INotificationsRepository';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationEntity } from '../models/NotificationEntity';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import {Repository} from "typeorm";

export class TypeORMNotificationRepository implements INotificationsRepository {
    private readonly notificationRepository: Repository<NotificationEntity>;

    constructor() {
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized for Notifications');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization for Notifications', err);
            });

        this.notificationRepository = AppDataSource.getRepository(NotificationEntity);

    }

    async findLastNotificationByTypeAndTypeId(
        type: NotificationTypeEnum,
        typeId: string
    ): Promise<Notification | null> {
        const entity = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.payload ->> "type" = :type', { type })
            .andWhere('notification.contentId = :typeId', { typeId })
            .orderBy('notification.date', 'DESC')
            .getOne();
    
        return entity ? NotificationMapper.toDomain(entity) : null;
    }

    async deleteAllNotificationsByRecipient(recipient: string): Promise<void> {
        await this.notificationRepository.delete({ recipient });
    }

    async findByTypeAndTypeId(type: NotificationTypeEnum, typeId: string): Promise<Notification[]> {
        const entities = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.payload ->> "type" = :type', { type })
            .andWhere('notification.contentId = :typeId', { typeId })
            .getMany();
    
        return entities.map(NotificationMapper.toDomain);
    }
    

    async create(notification: Notification): Promise<void> {
        const notificationEntity = NotificationMapper.toEntity(notification);
        await this.notificationRepository.save(notificationEntity);
    }

    async findById(id: string): Promise<Notification | null> {
        const entity = await this.notificationRepository.findOne({ where: { entityId: id } });
        return entity ? NotificationMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<Notification[]> {
        const entities = await this.notificationRepository.find();
        return entities.map(NotificationMapper.toDomain);
    }

    async deleteById(id: string): Promise<void> {
        await this.notificationRepository.delete({ entityId: id });
    }

    async deleteAll(): Promise<void> {
        await this.notificationRepository.clear();
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.notificationRepository.count({ where: { entityId: id } });
        return count > 0;
    }

    async getAllNotifications(userId: string): Promise<Notification[]> {
        const entities = await this.notificationRepository.find({ where: { recipient: userId } });
        return entities.map(NotificationMapper.toDomain);
    }

    async update(entity: Notification, id: string): Promise<Notification> {
        const existingEntity = await this.findById(id);
        if (!existingEntity) {
            throw new Error('Notification not found');
        }

        const updatedEntity = NotificationMapper.toEntity(entity);
        await this.notificationRepository.save(updatedEntity);
        return NotificationMapper.toDomain(updatedEntity);
    }
}
