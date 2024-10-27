import {
    Entity,
    Column,
    CreateDateColumn,
    Unique
} from 'typeorm';
import { NotificationTypeEnum } from '../../../domain/enum/NotificationTypeEnum';
import { NotificationStatusEnum } from '../../../domain/enum/NotificationStatusEnum';
import { Message } from '../../../domain/entities/Message';
import { Event } from '../../../domain/entities/Event';
import { Match } from '../../../domain/entities/Match';
import { App } from '../../../domain/entities/App';

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
    payload!: Message | Event | Match | App;

    @CreateDateColumn({ type: 'timestamp' })
    date!: Date;

    @Column({ type: 'uuid' })
    recipient!: string;
}
