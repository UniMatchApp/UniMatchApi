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
router.delete('', validateAndRefreshToken, notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/:id', validateAndRefreshToken, notificationsController.deleteNotification.bind(notificationsController));
router.post('/seen/:id', validateAndRefreshToken, notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('', validateAndRefreshToken, notificationsController.getAllNotifications.bind(notificationsController));

export {router};
