import {Router} from 'express';
import {MatchingController} from '../uniMatch/matching/MatchingController';
import {eventBus} from '../Dependencies';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {InMemoryMatchingRepository} from "@/core/uniMatch/matching/infrastructure/InMemory/InMemoryMatchingRepository";

const router = Router();

// const matchingRepository:IMatchingRepository = new Neo4JMatchingRepository();
const matchingRepository: IMatchingRepository = new InMemoryMatchingRepository();
const matchingController = new MatchingController(matchingRepository, eventBus);

router.post('/dislike/:userId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/like/:userId', matchingController.userLikedSomebody.bind(matchingController));
router.get('/likes/:userId', matchingController.usersThatLikedUser.bind(matchingController));

export {router};
