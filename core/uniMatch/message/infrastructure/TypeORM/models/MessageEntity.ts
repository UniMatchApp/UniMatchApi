import { Schema, model, Document } from 'mongoose';
import { MessageReceptionStatusEnum, MessageDeletedStatusType, MessageReceptionStatusType, MessageDeletedStatusEnum } from '@/core/shared/domain/MessageReceptionStatusEnum';
import { ObjectId } from 'mongodb';

interface IMessageEntity extends Document {
    _id: ObjectId;
    content: string;
    status: MessageReceptionStatusType;
    deletedStatus: MessageDeletedStatusType;
    timestamp: Date;
    sender: string;
    recipient: string;
    attachment?: string | null;
}

const MessageSchema = new Schema<IMessageEntity>({
    _id: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: Object.values(MessageReceptionStatusEnum), required: true },
    deletedStatus: { type: String, enum: Object.values(MessageDeletedStatusEnum), required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    sender: { type: String, required: true, maxlength: 255 },
    recipient: { type: String, required: true, maxlength: 255 },
    attachment: { type: String, default: null }
});

const MessageModel = model<IMessageEntity>('Message', MessageSchema);

export { IMessageEntity, MessageModel };
