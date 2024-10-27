import {Router} from 'express';
import {eventBus} from '../Main';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {
    InMemoryNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/InMemory/InMemoryNotificationRepository";
import {WebSocketAppNotifications} from "@/apps/RestApi/WS/WebSocketsAppNotifications";
import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";

const router = Router();

const notificationsRepository: INotificationsRepository = new InMemoryNotificationRepository();
const appNotifications: IAppNotifications = new WebSocketAppNotifications();
const notificationsController = new NotificationsController(notificationsRepository, eventBus, appNotifications);

router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
