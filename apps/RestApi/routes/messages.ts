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
router.put('/:messageId', fileUploadMiddleware, messageController.updateMessage.bind(messageController));
router.get('', messageController.retrieveMessagesFromUserPaginated.bind(messageController));
router.delete('/:messageId', messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/:messageId', messageController.deleteMessage.bind(messageController));
router.post('/read/:messageId', messageController.messageHasBeenRead.bind(messageController));
router.get('/user/:userId', messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/paginated/:userId', messageController.retrieveMessagesWithUserPaginated.bind(messageController));
router.get('/last/:userId', messageController.retrieveUserLastMessages.bind(messageController));

export {router};