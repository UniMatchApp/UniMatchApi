import {Router} from 'express';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {EventController} from "@/apps/RestApi/uniMatch/event/EventController";
import {dependencies} from "@/apps/RestApi/Dependencies";
import { validateAndRefreshToken } from '../utils/TokenMiddleware';

const router = Router();

const eventController = new EventController(dependencies.eventRepository, dependencies.eventBus, dependencies.fileHandler);

router.get('/', eventController.getAll.bind(eventController));
router.get('/:id', eventController.getOne.bind(eventController));
router.post('/', validateAndRefreshToken, fileUploadMiddleware, eventController.create.bind(eventController));
router.put('/:id', validateAndRefreshToken, fileUploadMiddleware, eventController.update.bind(eventController));
router.delete('/:id', validateAndRefreshToken, eventController.delete.bind(eventController));
router.post('/participate/:id', validateAndRefreshToken, eventController.participateEvent.bind(eventController));
router.post('/unparticipate/:id', validateAndRefreshToken, eventController.removeParticipation.bind(eventController));
router.post('like/:id', validateAndRefreshToken, eventController.likeEvent.bind(eventController));
router.post('dislike/:id', validateAndRefreshToken, eventController.dislikeEvent.bind(eventController));
router.put('/:id', validateAndRefreshToken, eventController.createSurvey.bind(eventController));
router.delete('/:id/survey/:title', validateAndRefreshToken, eventController.deleteSurvey.bind(eventController));
router.put('/:id/survey/:title/select', validateAndRefreshToken, eventController.selectSurvey.bind(eventController));
router.put('/:id/survey/:title/deselect', validateAndRefreshToken, eventController.deselectSurvey.bind(eventController));

export {router};    
