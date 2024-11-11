import {Router} from 'express';
import {eventBus, wsClientHandler} from '../Dependencies';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {AppNotifications} from '@/core/uniMatch/notifications/infrastructure/AppNotifications';
import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import {
    TypeORMNotificationRepository
} from '@/core/uniMatch/notifications/infrastructure/TypeORM/repositories/TypeORMNotificationRepository';
import {EmailNotifications} from '@/core/shared/infrastructure/EmailNotifications';
import {IEmailNotifications} from '@/core/shared/application/IEmailNotifications';
import {
    InMemoryNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/InMemory/InMemoryNotificationRepository";

const router = Router();

// const notificationsRepository: INotificationsRepository = new TypeORMNotificationRepository();
const notificationsRepository: INotificationsRepository = new InMemoryNotificationRepository();

const appNotifications: IAppNotifications = new AppNotifications(wsClientHandler);
const emailNotifications: IEmailNotifications = new EmailNotifications();
const notificationsController = new NotificationsController(notificationsRepository, eventBus, appNotifications, emailNotifications);

router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
