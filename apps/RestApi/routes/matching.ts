import {Router} from 'express';
import {MatchingController} from '../uniMatch/matching/MatchingController';
import {dependencies} from "@/apps/RestApi/Dependencies";
import {validateAndRefreshToken} from '../utils/TokenMiddleware';

const router = Router();


const matchingController = new MatchingController(
    dependencies.matchingRepository,
    dependencies.eventBus
)

router.post('/dislike/:id/:dislikedUserId', validateAndRefreshToken ,matchingController.userDislikedSomebody.bind(matchingController));
router.post('/like/:id/:likedUserId', validateAndRefreshToken, matchingController.userLikedSomebody.bind(matchingController));
router.get('/likes/:id', validateAndRefreshToken, matchingController.usersThatLikedUser.bind(matchingController));
router.get('/potential-matches/:id/:limit', validateAndRefreshToken, matchingController.getUserPotentialMatches.bind(matchingController));
router.get('/mutual-likes/:id', validateAndRefreshToken, matchingController.getMutualLikes.bind(matchingController));

export {router};
