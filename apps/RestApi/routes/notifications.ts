import {Router} from 'express';
import {emailNotifications, eventBus, wsClientHandler} from '../Dependencies';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {AppNotifications} from '@/core/uniMatch/notifications/infrastructure/AppNotifications';
import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import {
    InMemoryNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/InMemory/InMemoryNotificationRepository";

const router = Router();

// const notificationsRepository: INotificationsRepository = new TypeORMNotificationRepository();
const notificationsRepository: INotificationsRepository = new InMemoryNotificationRepository();

const appNotifications: IAppNotifications = new AppNotifications(wsClientHandler);
const notificationsController = new NotificationsController(notificationsRepository, eventBus, appNotifications, emailNotifications);

router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
