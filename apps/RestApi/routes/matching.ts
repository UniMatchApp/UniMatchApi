import {Router} from 'express';
import {MatchingController} from '../uniMatch/matching/MatchingController';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();


const matchingController = new MatchingController(
    dependencies.matchingRepository,
    dependencies.eventBus
)

router.post('/dislike/:userId/:dislikedUserId', matchingController.userDislikedSomebody.bind(matchingController));
router.post('/like/:userId/:likedUserId', matchingController.userLikedSomebody.bind(matchingController));
router.get('/likes/:userId', matchingController.usersThatLikedUser.bind(matchingController));
router.get('/potential-matches/:userId/:limit', matchingController.getUserPotentialMatches.bind(matchingController));
router.get('/mutual-likes/:userId', matchingController.getMutualLikes.bind(matchingController));

export {router};
