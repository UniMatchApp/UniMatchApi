import { Schema, model, Document } from 'mongoose';
import { MessageReceptionStatusEnum, MessageDeletedStatusType, MessageReceptionStatusType } from '@/core/shared/domain/MessageReceptionStatusEnum';

interface IMessageEntity extends Document {
    content: string;
    status: MessageReceptionStatusType;
    deletedStatus: MessageDeletedStatusType;
    timestamp: Date;
    sender: string;
    recipient: string;
    attachment?: string | null;
}

const MessageSchema = new Schema<IMessageEntity>({
    content: { type: String, required: true },
    status: { type: String, enum: Object.values(MessageReceptionStatusEnum), required: true },
    deletedStatus: { type: String, enum: Object.values(MessageReceptionStatusEnum), required: true },
    timestamp: { type: Date, required: true },
    sender: { type: String, required: true, maxlength: 255 },
    recipient: { type: String, required: true, maxlength: 255 },
    attachment: { type: String, default: null }
});

const MessageModel = model<IMessageEntity>('Message', MessageSchema);

export { IMessageEntity, MessageModel };
