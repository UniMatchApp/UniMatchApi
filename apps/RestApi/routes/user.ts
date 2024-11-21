import {Router} from 'express';
import {UserController} from '../uniMatch/user/UserController';
import fileUploadMiddleware from '../utils/FileUploadMiddleware';
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();

const userController = new UserController(
    dependencies.userRepository,
    dependencies.profileRepository,
    dependencies.emailNotifications,
    dependencies.eventBus,
    dependencies.fileHandler
);

router.post('/:id/block/:targetId', userController.blockUser.bind(userController));
router.put('/:id/about', userController.changeAboutMe.bind(userController));
// router.put('/:id/fact', userController.changeFact.bind(userController));
router.put('/:id/degree', userController.changeDegree.bind(userController));
router.put('/:id/drinks', userController.changeDrinks.bind(userController));
router.put('/:id/email', userController.changeEmail.bind(userController));
router.put('/:id/height', userController.changeHeight.bind(userController));
router.put('/:id/horoscope', userController.changeHoroscope.bind(userController));
router.put('/:id/interests', userController.changeInterests.bind(userController));
router.put('/:id/job', userController.changeJob.bind(userController));
router.put('/password/:id', userController.changePassword.bind(userController));
router.put('/:id/personality', userController.changePersonality.bind(userController));
router.put('/:id/pets', userController.changePets.bind(userController));
router.put('/:id/fact', userController.changeFact.bind(userController));
router.put('/:id/relationship-type', userController.changeRelationshipType.bind(userController));
router.put('/:id/sexual-orientation', userController.changeSexualOrientation.bind(userController));
router.put('/:id/gender', userController.changeGender.bind(userController));
router.put('/:id/smokes', userController.changeSmokes.bind(userController));
router.put('/:id/sports', userController.changeSports.bind(userController));
router.put('/:id/values-and-beliefs', userController.changeValuesAndBeliefs.bind(userController));
// router.put('/:id/gender-priority', userController.changeGenderPriority.bind(userController));
// router.put('/:id/age-range', userController.changeAgeRange.bind(userController));
// router.put('/:id/age', userController.changeAge.bind(userController));
// router.put('/:id/max-distance', userController.changeMaxDistance.bind(userController));
router.put('/:id/weight', userController.changeWeight.bind(userController));
router.post('/:id', fileUploadMiddleware, userController.createProfile.bind(userController));
router.post('', userController.createUser.bind(userController));
router.delete('/:id/delete-photo/:photoUrl', userController.deletePhoto.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.get('/:id', userController.getProfile.bind(userController));
router.post('/auth/login', userController.login.bind(userController));
router.post('/:id/report/:targetId', userController.reportUser.bind(userController));
router.post('/:id/photo', fileUploadMiddleware, userController.uploadPhoto.bind(userController));
router.post('/auth/:email/forgot-password', userController.forgotPassword.bind(userController));
router.post('/auth/:email/resend-code', userController.resendCode.bind(userController));
router.post('/auth/:email/verify-code/:code', userController.verifyCode.bind(userController));

export {router};
