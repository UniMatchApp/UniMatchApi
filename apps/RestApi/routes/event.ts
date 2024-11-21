import {Router} from 'express';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {EventController} from "@/apps/RestApi/uniMatch/event/EventController";
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();

const eventController = new EventController(dependencies.eventRepository, dependencies.eventBus);
// Define las rutas
router.get('/', eventController.getAll.bind(eventController));
router.get('/:id', eventController.getOne.bind(eventController));
router.post('/', fileUploadMiddleware, eventController.create.bind(eventController));
router.put('/:id', fileUploadMiddleware, eventController.update.bind(eventController));
router.delete('/:id', eventController.delete.bind(eventController));
router.post('/participate/:id/:userId', eventController.participateEvent.bind(eventController));
router.post('/unparticipate/:id/:userId', eventController.removeParticipation.bind(eventController));
router.post('like/:id/:userId', eventController.likeEvent.bind(eventController));
router.post('dislike/:id/:userId', eventController.dislikeEvent.bind(eventController));


export {router};
