import { Router } from 'express';
import { MatchingController } from '../uniMatch/matching/MatchingController';
import { MatchingRepository } from '@/core/uniMatch/matching/infrastructure/neo4j/repositories/MatchingRepository';
import { eventBus } from '../Main';

const router = Router();

const matchingRepository = new MatchingRepository();
const matchingController = new MatchingController(matchingRepository, eventBus);

router.post('/matching/dislike/:userId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/matching/like/:userId', matchingController.userLikedSomebody.bind(matchingController));

export { router };
