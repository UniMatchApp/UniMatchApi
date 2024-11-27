import { Entity, Column, Unique, ObjectIdColumn } from 'typeorm';
import { MessageReceptionStatusEnum, MessageDeletedStatusType, MessageReceptionStatusType } from '@/core/shared/domain/MessageReceptionStatusEnum';

@Entity('messages')
@Unique(['id'])
export class MessageEntity {
    @ObjectIdColumn()
    id!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'enum', enum: MessageReceptionStatusEnum })
    status!: MessageReceptionStatusType;

    @Column({ type: 'enum', enum: MessageReceptionStatusEnum })
    deletedStatus!: MessageDeletedStatusType;

    @Column({ type: 'timestamp' })
    timestamp!: Date;

    @Column({ type: 'varchar', length: 255 })
    sender!: string;

    @Column({ type: 'varchar', length: 255 })
    recipient!: string;

    @Column({ type: 'text', nullable: true })
    attachment?: string | null;
}
