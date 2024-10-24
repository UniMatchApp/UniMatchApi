import { Router } from 'express';
import { eventBus } from '../Main';
import { MessageController } from '../uniMatch/message/MessageController';
import { MessageRepository } from '@/core/uniMatch/message/infrastructure/TypeORM/repositories/MessageRepository';

const router = Router();

const messageRepository = new MessageRepository();
const messageController = new MessageController(messageRepository, eventBus);

router.post('/messages', messageController.createMessage.bind(messageController));
router.delete('/messages/:userId', messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/message/:userId', messageController.deleteMessage.bind(messageController));
router.post('/message/read/:messageId', messageController.messageHasBeenRead.bind(messageController));
router.get('/messages/user/:userId', messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/messages/paginated/:userId', messageController.retrieveMessagesWithUserPaginated.bind(messageController));
router.get('/messages/last/:userId', messageController.retrieveUserLastMessages.bind(messageController));
router.put('/message/:userId', messageController.updateMessage.bind(messageController));

export { router };