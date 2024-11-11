import { Router } from 'express';
import { EventController } from '../uniMatch/event/EventController';
import { TypeORMEventRepository } from '@/core/uniMatch/event/infrastructure/TypeORM/repositories/TypeORMEventRepository';
import { eventBus } from '../Dependencies';
import {InMemoryEventRepository} from "@/core/uniMatch/event/infrastructure/InMemory/InMemoryEventRepository";
import {IEventRepository} from "@/core/uniMatch/event/application/ports/IEventRepository";

const router = Router();
// const eventRepository: IEventRepository = new TypeORMEventRepository();
const eventRepository: IEventRepository = new InMemoryEventRepository();
const eventController = new EventController(eventRepository, eventBus);

// Define las rutas
router.get('/', eventController.getAll.bind(eventController));
router.get('/:id', eventController.getOne.bind(eventController));
router.post('/', eventController.create.bind(eventController));
router.put('/:id', eventController.update.bind(eventController));
router.delete('/:id', eventController.delete.bind(eventController));
router.post('/participate/:id/:userId', eventController.participateEvent.bind(eventController));
router.post('/unparticipate/:id/:userId', eventController.removeParticipation.bind(eventController));
router.post('like/:id/:userId', eventController.likeEvent.bind(eventController));
router.post('dislike/:id/:userId', eventController.dislikeEvent.bind(eventController));


export { router };
