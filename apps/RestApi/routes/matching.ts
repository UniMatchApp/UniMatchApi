import {Router} from 'express';
import {MatchingController} from '../uniMatch/matching/MatchingController';
import {eventBus, profileRepository} from '../Dependencies';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {InMemoryMatchingRepository} from "@/core/uniMatch/matching/infrastructure/InMemory/InMemoryMatchingRepository";

const router = Router();

// const matchingRepository:IMatchingRepository = new Neo4JMatchingRepository();
const matchingRepository: IMatchingRepository = new InMemoryMatchingRepository();
const matchingController = new MatchingController(matchingRepository, profileRepository, eventBus);

router.post('/dislike/:userId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/like/:userId', matchingController.userLikedSomebody.bind(matchingController));
router.get('/likes/:userId', matchingController.usersThatLikedUser.bind(matchingController));
router.get('/potential-matches/:userId', matchingController.getUserPotentialMatches.bind(matchingController));
router.get('/mutual-likes/:userId', matchingController.getMutualLikes.bind(matchingController));

export {router};
