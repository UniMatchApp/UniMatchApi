import {Router} from 'express';
import {MatchingController} from '../uniMatch/matching/MatchingController';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();


const matchingController = new MatchingController(
    dependencies.matchingRepository,
    dependencies.profileRepository,
    dependencies.eventBus
)

router.post('/dislike/:userId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/like/:userId', matchingController.userLikedSomebody.bind(matchingController));
router.get('/likes/:userId', matchingController.usersThatLikedUser.bind(matchingController));
router.get('/potential-matches/:userId', matchingController.getUserPotentialMatches.bind(matchingController));
router.get('/mutual-likes/:userId', matchingController.getMutualLikes.bind(matchingController));

export {router};
