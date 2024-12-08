import {Router} from 'express';
import {MessageController} from '../uniMatch/message/MessageController';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {dependencies} from "@/apps/RestApi/Dependencies";
import {validateAndRefreshToken} from "@/apps/RestApi/utils/TokenMiddleware";

const router = Router();


const messageController = new MessageController(
    dependencies.messageRepository,
    dependencies.eventBus,
    dependencies.fileHandler
);

router.post('', validateAndRefreshToken, fileUploadMiddleware, messageController.createMessage.bind(messageController));
router.get('', validateAndRefreshToken, messageController.retrieveMessagesFromUserPaginated.bind(messageController));
router.delete('/:targetId', validateAndRefreshToken, messageController.deleteAllMessagesWithUser.bind(messageController));
router.delete('/:messageId', validateAndRefreshToken, messageController.deleteMessage.bind(messageController));
router.post('/read/:messageId', validateAndRefreshToken, messageController.messageHasBeenRead.bind(messageController));
router.get('/user/:targetId', validateAndRefreshToken, messageController.retrieveMessagesWithUser.bind(messageController));
router.get('/last', validateAndRefreshToken, messageController.retrieveUserLastMessages.bind(messageController));
router.put('/:messageId', validateAndRefreshToken, fileUploadMiddleware, messageController.updateMessage.bind(messageController));

export {router};