import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageModel } from '@/core/uniMatch/message/infrastructure/TypeORM/models/MessageEntity';

export class MessageMapper {
    static toDomain(entity: any): Message {
        const message = new Message(
            entity.content,
            entity.sender,
            entity.recipient,
            entity.attachment || undefined
        );

        message.receptionStatus = entity.receptionStatus;
        message.contentStatus = entity.contentStatus;
        message.timestamp = entity.timestamp;
        message.setId(entity._id.toString());
        message.deletedStatus = entity.deletedStatus;

        return message;
    }

    static toEntity(domain: Message): any {
        const messageEntity = new MessageModel({
            _id: domain.getId(),
            content: domain.content,
            receptionStatus: domain.receptionStatus,
            contentStatus: domain.contentStatus,
            deletedStatus: domain.deletedStatus,
            timestamp: domain.timestamp,
            sender: domain.sender,
            recipient: domain.recipient,
            attachment: domain.attachment
        });

        messageEntity.toObject();

        return messageEntity;
    }
}
