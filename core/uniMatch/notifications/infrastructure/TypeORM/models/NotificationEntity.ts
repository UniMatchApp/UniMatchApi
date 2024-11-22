import {
    Entity,
    Column,
    CreateDateColumn,
    Unique
} from 'typeorm';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { NotificationStatusEnum } from '../../../domain/enum/NotificationStatusEnum';
import { MessageNotificationPayload } from '../../../domain/entities/MessageNotificationPayload';
import { EventNotificationPayload } from '../../../domain/entities/EventNotificationPayload';
import { MatchNotificationPayload } from '../../../domain/entities/MatchNotificationPayload';
import { AppNotificationPayload } from '../../../domain/entities/AppNotificationPayload';

@Entity('notifications')
@Unique(['id'])
export class NotificationEntity {
    @Column({ type: 'uuid', primary: true })
    id!: string;

    @Column({
        type: 'enum',
        enum: NotificationTypeEnum,
    })
    type!: NotificationTypeEnum;

    @Column({
        type: 'enum',
        enum: NotificationStatusEnum,
        default: NotificationStatusEnum.SENT,
    })
    status!: NotificationStatusEnum;

    @Column({ type: 'uuid' })
    contentId!: string;

    @Column('jsonb')
    payload!: MessageNotificationPayload | EventNotificationPayload | MatchNotificationPayload | AppNotificationPayload;

    @CreateDateColumn({ type: 'timestamp' })
    date!: Date;

    @Column({ type: 'uuid' })
    recipient!: string;
}
