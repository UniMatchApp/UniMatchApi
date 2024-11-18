import { Router } from 'express';
import { eventBus } from '../Dependencies';
import { MessageController } from '../uniMatch/message/MessageController';
import { TypeORMMessageRepository } from '@/core/uniMatch/message/infrastructure/TypeORM/repositories/TypeORMMessageRepository';
import {InMemoryMessageRepository} from "@/core/uniMatch/message/infrastructure/InMemory/InMemoryMessageRepository";
import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import fileUploadMiddleware from '../FileUploadMiddleware';

const router = Router();

// const messageRepository:IMessageRepository = new TypeORMMessageRepository();
const messageRepository:IMessageRepository = new InMemoryMessageRepository();
const messageController = new MessageController(messageRepository, eventBus);

router.post('', fileUploadMiddleware ,messageController.createMessage.bind(messageController));
router.get('', messageController.retrieveMessagesFromUserPaginated.bind(messageController));
router.delete('/:userId', messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/:userId', messageController.deleteMessage.bind(messageController));
router.post('/read/:messageId', messageController.messageHasBeenRead.bind(messageController));
router.get('/user/:userId', messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/paginated/:userId', messageController.retrieveMessagesWithUserPaginated.bind(messageController));
router.get('/last/:userId', messageController.retrieveUserLastMessages.bind(messageController));
router.put('/:userId', fileUploadMiddleware, messageController.updateMessage.bind(messageController));

export { router };