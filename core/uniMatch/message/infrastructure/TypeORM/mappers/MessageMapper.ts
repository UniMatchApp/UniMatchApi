import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageModel } from '@/core/uniMatch/message/infrastructure/TypeORM/models/MessageEntity';
import { MessageReceptionStatusType } from '@/core/shared/domain/MessageReceptionStatusEnum';
import { TransformFromUndefinedToNull } from '@/core/shared/infrastructure/decorators/TransformFromUndefinedToNull';

export class MessageMapper {
    static toDomain(entity: any): Message {
        const message = new Message(
            entity.content,
            entity.sender,
            entity.recipient,
            entity.attachment || undefined
        );

        message.receptionStatus = entity.status;
        message.timestamp = entity.timestamp;
        message.setId(entity._id.toString()); // En Mongoose, el ID es _id, no id
        message.deletedStatus = entity.deletedStatus;

        return message;
    }

    @TransformFromUndefinedToNull
    static toEntity(domain: Message): any { // Usamos 'any' porque Mongoose devuelve un documento
        const messageEntity = new MessageModel({
            _id: domain.getId(), // _id en lugar de id
            content: domain.content,
            status: domain.receptionStatus as MessageReceptionStatusType,
            deletedStatus: domain.deletedStatus,
            timestamp: domain.timestamp,
            sender: domain.sender,
            recipient: domain.recipient,
            attachment: domain.attachment
        });

        return messageEntity;
    }
}
