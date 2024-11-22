import { Entity, Column, Unique, ObjectIdColumn } from 'typeorm';
import { MessageStatusEnum, DeletedMessageStatusType, MessageStatusType } from '@/core/shared/domain/MessageStatusEnum';

@Entity('messages')
@Unique(['id'])
export class MessageEntity {
    @ObjectIdColumn()
    id!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'enum', enum: MessageStatusEnum })
    status!: MessageStatusType;

    @Column({ type: 'enum', enum: MessageStatusEnum })
    deletedStatus!: DeletedMessageStatusType;

    @Column({ type: 'timestamp' })
    timestamp!: Date;

    @Column({ type: 'varchar', length: 255 })
    sender!: string;

    @Column({ type: 'varchar', length: 255 })
    recipient!: string;

    @Column({ type: 'text', nullable: true })
    attachment?: string;
}
