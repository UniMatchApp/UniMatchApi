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
router.delete('/:userId', messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/:userId', messageController.deleteMessage.bind(messageController));
router.post('/read/:messageId', messageController.messageHasBeenRead.bind(messageController));
router.get('/user/:userId', messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/paginated/:userId', messageController.retrieveMessagesWithUserPaginated.bind(messageController));
router.get('/last/:userId', messageController.retrieveUserLastMessages.bind(messageController));
router.put('/:userId', fileUploadMiddleware, messageController.updateMessage.bind(messageController));

export {router};