import {Router} from 'express';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {dependencies} from "@/apps/RestApi/Dependencies";
import {validateAndRefreshToken} from '../utils/TokenMiddleware';

const router = Router();


const notificationsController = new NotificationsController(
    dependencies.notificationsRepository,
    dependencies.eventBus,
    dependencies.appNotifications,
    dependencies.emailNotifications
);
router.delete('/notifications/:id', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:id', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:id', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:id', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
