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
router.delete('/notifications', validateAndRefreshToken, notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notifications/:id', validateAndRefreshToken, notificationsController.deleteNotification.bind(notificationsController));
router.post('/notifications/seen/:id', validateAndRefreshToken, notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications', validateAndRefreshToken, notificationsController.getAllNotifications.bind(notificationsController));

export {router};
