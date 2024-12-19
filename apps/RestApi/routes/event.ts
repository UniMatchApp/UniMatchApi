import {Router} from 'express';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {EventController} from "@/apps/RestApi/uniMatch/event/EventController";
import {dependencies} from "@/apps/RestApi/Dependencies";
import { validateAndRefreshToken } from '../utils/TokenMiddleware';

const router = Router();

const eventController = new EventController(dependencies.eventRepository, dependencies.eventBus);
// Define las rutas
router.get('/', eventController.getAll.bind(eventController));
router.get('/:id', eventController.getOne.bind(eventController));
router.post('/', validateAndRefreshToken, fileUploadMiddleware, eventController.create.bind(eventController));
router.put('/:id', validateAndRefreshToken, fileUploadMiddleware, eventController.update.bind(eventController));
router.delete('/:id', validateAndRefreshToken, eventController.delete.bind(eventController));
router.post('/participate/:id', validateAndRefreshToken, eventController.participateEvent.bind(eventController));
router.post('/unparticipate/:id', validateAndRefreshToken, eventController.removeParticipation.bind(eventController));
router.post('like/:id', validateAndRefreshToken, eventController.likeEvent.bind(eventController));
router.post('dislike/:id', validateAndRefreshToken, eventController.dislikeEvent.bind(eventController));


export {router};
