import { Schema, model, Document } from 'mongoose';
import { MessageReceptionStatusEnum, MessageDeletedStatusType, MessageReceptionStatusType, MessageDeletedStatusEnum, MessageContentStatusEnum } from '@/core/shared/domain/MessageReceptionStatusEnum';
import { ObjectId } from 'mongodb';

interface IMessageEntity extends Document {
    _id: ObjectId;
    content: string;
    receptionStatus: MessageReceptionStatusType;
    contentStatus: MessageContentStatusEnum;
    deletedStatus: MessageDeletedStatusType;
    createdAt: Date;
    updatedAt: Date;
    sender: string;
    recipient: string;
    attachment?: string | null;
}

const MessageSchema = new Schema<IMessageEntity>({
    _id: { type: String, required: true },
    content: { type: String, required: true },
    receptionStatus: { type: String, enum: Object.values(MessageReceptionStatusEnum), required: true },
    contentStatus: { type: String, enum: Object.values(MessageContentStatusEnum), required: true },
    deletedStatus: { type: String, enum: Object.values(MessageDeletedStatusEnum), required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    sender: { type: String, required: true, maxlength: 255 },
    recipient: { type: String, required: true, maxlength: 255 },
    attachment: { type: String, default: null }
});

const MessageEntity = model<IMessageEntity>('Message', MessageSchema);

export { IMessageEntity, MessageEntity };
