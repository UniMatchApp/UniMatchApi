import { Router } from 'express';
import { eventBus } from '../Main'; // Asegúrate de que `eventBus` esté correctamente exportado desde Main
import { NotificationsController } from '../uniMatch/notifications/NotificationsController';
import { NotificationRepository } from '@/core/uniMatch/notifications/infrastructure/TypeORM/repositories/NotificationRepository';

const router = Router();

const notificationsRepository = new NotificationRepository();
const notificationsController = new NotificationsController(notificationsRepository, eventBus);

router.delete('/notifications/:userId', notificationsController.deletedAllNotifications.bind(notificationsController));
router.delete('/notification/:userId', notificationsController.deleteNotification.bind(notificationsController));
router.post('/notification/seen/:userId', notificationsController.NotificationHasBeenSeen.bind(notificationsController));
router.get('/notifications/:userId', notificationsController.getAllNotifications.bind(notificationsController));

export { router };
