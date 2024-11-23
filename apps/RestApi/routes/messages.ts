import {Router} from 'express';
import {MessageController} from '../uniMatch/message/MessageController';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();


const messageController = new MessageController(
    dependencies.messageRepository,
    dependencies.eventBus,
    dependencies.fileHandler
);

router.post('', fileUploadMiddleware, messageController.createMessage.bind(messageController));
router.get('', messageController.retrieveMessagesFromUserPaginated.bind(messageController));
router.delete('/:id', messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/:id', messageController.deleteMessage.bind(messageController));
router.post('/read/:messageId', messageController.messageHasBeenRead.bind(messageController));
router.get('/user/:id', messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/paginated/:id', messageController.retrieveMessagesWithUserPaginated.bind(messageController));
router.get('/last/:id', messageController.retrieveUserLastMessages.bind(messageController));
router.put('/:id', fileUploadMiddleware, messageController.updateMessage.bind(messageController));

export {router};