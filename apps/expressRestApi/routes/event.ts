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

export { router };
