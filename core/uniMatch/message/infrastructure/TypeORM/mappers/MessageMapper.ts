import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageEntity } from '../models/MessageEntity';
import { MessageStatusType } from '@/core/shared/domain/MessageStatusEnum';

export class MessageMapper {
    static toDomain(entity: MessageEntity): Message {
        const message = new Message(
            entity.content,
            entity.sender,
            entity.recipient,
            entity.attachment
        );

        message.status = entity.status;
        message.timestamp = entity.timestamp;
        message.setId(entity.id.toString());
        message.deletedStatus = entity.deletedStatus;

        return message;
    }

    static toEntity(domain: Message): MessageEntity {
        const messageEntity = new MessageEntity();
        messageEntity.id = domain.getId()
        messageEntity.content = domain.content;
        messageEntity.status = domain.status as MessageStatusType;
        messageEntity.deletedStatus = domain.deletedStatus;
        messageEntity.timestamp = domain.timestamp;
        messageEntity.sender = domain.sender;
        messageEntity.recipient = domain.recipient;
        messageEntity.attachment = domain.attachment;

        return messageEntity;
    }
}
