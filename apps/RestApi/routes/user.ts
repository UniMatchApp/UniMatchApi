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

router.post('/block/:targetId', validateAndRefreshToken, userController.blockUser.bind(userController));
router.put('/about', validateAndRefreshToken, userController.changeAboutMe.bind(userController));
// router.put('/:id/fact', userController.changeFact.bind(userController));
router.put('/degree', validateAndRefreshToken, userController.changeDegree.bind(userController));
router.put('/location', validateAndRefreshToken, userController.changeLocation.bind(userController));
router.put('/drinks', validateAndRefreshToken, userController.changeDrinks.bind(userController));
router.put('/email', validateAndRefreshToken, userController.changeEmail.bind(userController));
router.put('/height', validateAndRefreshToken, userController.changeHeight.bind(userController));
router.put('/horoscope', validateAndRefreshToken, userController.changeHoroscope.bind(userController));
router.put('/interests', validateAndRefreshToken, userController.changeInterests.bind(userController));
router.put('/job', validateAndRefreshToken, userController.changeJob.bind(userController));
router.put('/password', validateAndRefreshToken, userController.changePassword.bind(userController));
router.put('/personality', validateAndRefreshToken, userController.changePersonality.bind(userController));
router.put('/pets', validateAndRefreshToken, userController.changePets.bind(userController));
router.put('/fact', validateAndRefreshToken, userController.changeFact.bind(userController));
router.put('/relationship-type', validateAndRefreshToken, userController.changeRelationshipType.bind(userController));
router.put('/sexual-orientation', validateAndRefreshToken, userController.changeSexualOrientation.bind(userController));
router.put('/gender', validateAndRefreshToken, userController.changeGender.bind(userController));
router.put('/smokes', validateAndRefreshToken, userController.changeSmokes.bind(userController));
router.put('/sports', validateAndRefreshToken, userController.changeSports.bind(userController));
router.put('/values-and-beliefs', validateAndRefreshToken, userController.changeValuesAndBeliefs.bind(userController));
router.put('/gender-priority', validateAndRefreshToken, userController.changeGenderPriority.bind(userController));
router.put('/age-range', validateAndRefreshToken, userController.changeAgeRange.bind(userController));
// router.put('/age', userController.changeAge.bind(userController));
router.put('/max-distance', validateAndRefreshToken, userController.changeMaxDistance.bind(userController));
router.put('/weight', validateAndRefreshToken, userController.changeWeight.bind(userController));
router.put('/wall', validateAndRefreshToken, userController.changeWall.bind(userController));
router.post('/profile', validateAndRefreshToken, fileUploadMiddleware, userController.createProfile.bind(userController));
router.post('', userController.createUser.bind(userController));
router.delete('/delete-photo/:photoUrl', validateAndRefreshToken, userController.deletePhoto.bind(userController));
router.delete('', validateAndRefreshToken, userController.deleteUser.bind(userController));
router.get('/:id', userController.getProfile.bind(userController));
router.post('/auth/login', userController.login.bind(userController));
router.post('/report/:targetId', validateAndRefreshToken, userController.reportUser.bind(userController));
router.post('/photo', fileUploadMiddleware, validateAndRefreshToken, userController.uploadPhoto.bind(userController));
router.post('/auth/:email/forgot-password', userController.forgotPassword.bind(userController));
router.post('/auth/:email/resend-code', userController.resendCode.bind(userController));
router.post('/auth/:email/verify-code/:code', userController.verifyCode.bind(userController));

export {router};
