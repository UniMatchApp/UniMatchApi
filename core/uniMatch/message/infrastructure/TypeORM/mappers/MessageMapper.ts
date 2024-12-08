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
        message.deletedStatus = {
            _sender: entity.deletedStatusSender,
            _recipient: entity.deletedStatusRecipient
        }

        return message;
    }

    static toEntity(domain: Message): any {
        const messageEntity = new MessageEntity({
            _id: domain.getId(),
            content: domain.content,
            receptionStatus: domain.receptionStatus,
            contentStatus: domain.contentStatus,
            deletedStatusSender: domain.deletedStatus._sender,
            deletedStatusRecipient: domain.deletedStatus._recipient,
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
