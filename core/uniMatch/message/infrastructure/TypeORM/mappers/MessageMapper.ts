import { Message } from '@/core/uniMatch/message/domain/Message';
import {IMessageEntity, MessageEntity} from '@/core/uniMatch/message/infrastructure/TypeORM/models/MessageEntity';

export class MessageMapper {
    static toDomain(entity: IMessageEntity): Message {
        const message = new Message(
            entity.content,
            entity.sender,
            entity.recipient,
            entity.attachment || undefined
        );

        message.receptionStatus = entity.receptionStatus;
        message.contentStatus = entity.contentStatus;
        message.createdAt = entity.createdAt;
        message.updatedAt = entity.updatedAt;
        message.setId(entity._id.toString());
        message.deletedStatus = entity.deletedStatus;

        return message;
    }

    static toEntity(domain: Message): any {
        const messageEntity = new MessageEntity({
            _id: domain.getId(),
            content: domain.content,
            receptionStatus: domain.receptionStatus,
            contentStatus: domain.contentStatus,
            deletedStatus: domain.deletedStatus,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
            sender: domain.sender,
            recipient: domain.recipient,
            attachment: domain.attachment
        });

        messageEntity.toObject();

        return messageEntity;
    }
}
