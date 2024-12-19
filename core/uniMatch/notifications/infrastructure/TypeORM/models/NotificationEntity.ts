import { Schema, model, Document, Model } from 'mongoose';
import { NotificationStatusEnum } from '../../../domain/enum/NotificationStatusEnum';
import { MessageNotificationPayload } from '../../../domain/entities/MessageNotificationPayload';
import { EventNotificationPayload } from '../../../domain/entities/EventNotificationPayload';
import { MatchNotificationPayload } from '../../../domain/entities/MatchNotificationPayload';
import { AppNotificationPayload } from '../../../domain/entities/AppNotificationPayload';

interface INotificationEntity extends Document {
    _id: string;
    status: NotificationStatusEnum;
    contentId: string;
    payload: MessageNotificationPayload | EventNotificationPayload | MatchNotificationPayload | AppNotificationPayload;
    date: Date;
    recipient: string;
}

const NotificationSchema = new Schema<INotificationEntity>({
    _id: { type: String, required: true },
    status: { type: String, enum: Object.values(NotificationStatusEnum), default: NotificationStatusEnum.SENT, required: true },
    contentId: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    date: { type: Date, required: true, default: Date.now },
    recipient: { type: String, required: true }
});

const NotificationEntity = model<INotificationEntity>('Notification', NotificationSchema);

export { INotificationEntity, NotificationEntity, NotificationSchema};
