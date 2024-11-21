import {Router} from 'express';
import {NotificationsController} from '@/apps/RestApi/uniMatch/notifications/NotificationsController';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();


const notificationsController = new NotificationsController(
    dependencies.notificationsRepository,
    dependencies.eventBus,
    dependencies.appNotifications,
    dependencies.emailNotifications
);
router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export {router};
