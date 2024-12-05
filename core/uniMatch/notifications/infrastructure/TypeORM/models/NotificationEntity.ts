import {
    Entity,
    Column,
    CreateDateColumn,
    Unique,
    ObjectIdColumn
} from 'typeorm';
import { NotificationStatusEnum } from '../../../domain/enum/NotificationStatusEnum';
import { MessageNotificationPayload } from '../../../domain/entities/MessageNotificationPayload';
import { EventNotificationPayload } from '../../../domain/entities/EventNotificationPayload';
import { MatchNotificationPayload } from '../../../domain/entities/MatchNotificationPayload';
import { AppNotificationPayload } from '../../../domain/entities/AppNotificationPayload';
import { ObjectId } from 'mongodb';

@Entity('notifications')
export class NotificationEntity {
    @Column({ type: 'uuid' })
    entityId!: string;

    @ObjectIdColumn()
    _id!: ObjectId;

    @Column({
        type: 'enum',
        enum: NotificationStatusEnum,
        default: NotificationStatusEnum.SENT,
    })
    status!: NotificationStatusEnum;

    @Column({ type: 'uuid' })
    contentId!: string;

    @Column({ type: 'json' })
    payload!: MessageNotificationPayload | EventNotificationPayload | MatchNotificationPayload | AppNotificationPayload;

    @CreateDateColumn({ type: 'timestamp' })
    date!: Date;

    @Column({ type: 'uuid' })
    recipient!: string;
}
