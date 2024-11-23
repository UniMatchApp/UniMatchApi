import {Router} from 'express';
import {UserController} from '../uniMatch/user/UserController';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {validateAndRefreshToken} from '../utils/TokenMiddleware';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();

const userController = new UserController(
    dependencies.userRepository,
    dependencies.profileRepository,
    dependencies.emailNotifications,
    dependencies.eventBus,
    dependencies.fileHandler,
    dependencies.tokenService
);

router.post('/:id/block/:targetId', validateAndRefreshToken, userController.blockUser.bind(userController));
router.put('/:id/about', validateAndRefreshToken, userController.changeAboutMe.bind(userController));
// router.put('/:id/fact', userController.changeFact.bind(userController));
router.put('/:id/degree', validateAndRefreshToken, userController.changeDegree.bind(userController));
router.put('/:id/drinks', validateAndRefreshToken, userController.changeDrinks.bind(userController));
router.put('/:id/email', validateAndRefreshToken, userController.changeEmail.bind(userController));
router.put('/:id/height', validateAndRefreshToken, userController.changeHeight.bind(userController));
router.put('/:id/horoscope', validateAndRefreshToken, userController.changeHoroscope.bind(userController));
router.put('/:id/interests', validateAndRefreshToken, userController.changeInterests.bind(userController));
router.put('/:id/job', validateAndRefreshToken, userController.changeJob.bind(userController));
router.put('/password/:id', validateAndRefreshToken, userController.changePassword.bind(userController));
router.put('/:id/personality', validateAndRefreshToken, userController.changePersonality.bind(userController));
router.put('/:id/pets', validateAndRefreshToken, userController.changePets.bind(userController));
router.put('/:id/fact', validateAndRefreshToken, userController.changeFact.bind(userController));
router.put('/:id/relationship-type', validateAndRefreshToken, userController.changeRelationshipType.bind(userController));
router.put('/:id/sexual-orientation', validateAndRefreshToken, userController.changeSexualOrientation.bind(userController));
router.put('/:id/gender', validateAndRefreshToken, userController.changeGender.bind(userController));
router.put('/:id/smokes', validateAndRefreshToken, userController.changeSmokes.bind(userController));
router.put('/:id/sports', validateAndRefreshToken, userController.changeSports.bind(userController));
router.put('/:id/values-and-beliefs', validateAndRefreshToken, userController.changeValuesAndBeliefs.bind(userController));
// router.put('/:id/gender-priority', userController.changeGenderPriority.bind(userController));
// router.put('/:id/age-range', userController.changeAgeRange.bind(userController));
// router.put('/:id/age', userController.changeAge.bind(userController));
// router.put('/:id/max-distance', userController.changeMaxDistance.bind(userController));
router.put('/:id/weight', validateAndRefreshToken, userController.changeWeight.bind(userController));
router.put('/:id/wall', validateAndRefreshToken, userController.changeWall.bind(userController));
router.post('/:id', validateAndRefreshToken, fileUploadMiddleware, userController.createProfile.bind(userController));
router.post('', userController.createUser.bind(userController));
router.delete('/:id/delete-photo/:photoUrl', validateAndRefreshToken, userController.deletePhoto.bind(userController));
router.delete('/:id', validateAndRefreshToken, userController.deleteUser.bind(userController));
router.get('/:id', userController.getProfile.bind(userController));
router.post('/auth/login', userController.login.bind(userController));
router.post('/:id/report/:targetId', validateAndRefreshToken, userController.reportUser.bind(userController));
router.post('/:id/photo', fileUploadMiddleware, userController.uploadPhoto.bind(userController));
router.post('/auth/:email/forgot-password', userController.forgotPassword.bind(userController));
router.post('/auth/:email/resend-code', userController.resendCode.bind(userController));
router.post('/auth/:email/verify-code/:code', userController.verifyCode.bind(userController));

export {router};
