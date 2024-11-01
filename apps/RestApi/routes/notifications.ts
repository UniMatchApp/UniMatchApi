import {Router} from 'express';
import { eventBus } from '../Dependencies';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {
    InMemoryNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/InMemory/InMemoryNotificationRepository";
import { AppNotifications } from '@/core/uniMatch/notifications/infrastructure/AppNotifications';
import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import { TypeORMNotificationRepository } from '@/core/uniMatch/notifications/infrastructure/TypeORM/repositories/TypeORMNotificationRepository';
import { EmailNotifications } from '@/core/shared/infrastructure/EmailNotifications';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';
import { WebSocketsAppNotifications } from '../WS/WebSocketsAppNotifications';

const router = Router();

const notificationsRepository: INotificationsRepository = new TypeORMNotificationRepository();
const webSocketController = new WebSocketsAppNotifications(8080);
const appNotifications: IAppNotifications = new AppNotifications(webSocketController);
const emailNotifications: IEmailNotifications = new EmailNotifications();
const notificationsController = new NotificationsController(notificationsRepository, eventBus, appNotifications, emailNotifications);

router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
