import { Router } from 'express';
import { EventController } from '../uniMatch/event/EventController';
import { EventRepository } from '@/core/uniMatch/event/infrastructure/TypeORM/repositories/EventRepository';
import { eventBus } from '../Main';

const router = Router();
const eventRepository = new EventRepository();
const eventController = new EventController(eventRepository, eventBus);

// Define las rutas
router.get('/', eventController.getAll);
router.get('/:id', eventController.getOne);
router.post('/', eventController.create);
router.put('/:id', eventController.update);
router.delete('/:id', eventController.delete);
router.post('/participate/:id/:userId', eventController.participateEvent);
router.post('/unparticipate/:id/:userId', eventController.removeParticipation);
router.post('like/:id/:userId', eventController.likeEvent);
router.post('dislike/:id/:userId', eventController.dislikeEvent);


export { router };
