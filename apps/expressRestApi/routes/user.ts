import { Router } from 'express';
import { UserController } from '../uniMatch/user/UserController';
import { eventBus } from '../Main';
import { UserRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/UserRepository';
import { ProfileRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/ProfileRepository';

const router = Router();
const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();
const userController = new UserController(userRepository, profileRepository, eventBus);

// User endpoints
router.post('/users', userController.createUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
router.post('/users/:id/block', userController.blockUser.bind(userController));
router.put('/users/:id/about', userController.changeAboutMe.bind(userController));
router.put('/users/:id/degree', userController.changeDegree.bind(userController));
router.put('/users/:id/drinks', userController.changeDrings.bind(userController));
router.put('/users/:id/email', userController.changeEmail.bind(userController));
router.put('/users/:id/height', userController.changeHeight.bind(userController));
router.put('/users/:id/horoscope', userController.changeHoroscope.bind(userController));
router.put('/users/:id/interests', userController.changeInterests.bind(userController));
router.put('/users/:id/job', userController.changeJob.bind(userController));
router.put('/users/:id/password', userController.changePassword.bind(userController));
router.put('/users/:id/personality', userController.changePersonality.bind(userController));
router.put('/users/:id/pets', userController.changePets.bind(userController));
router.put('/users/:id/relationship-type', userController.changeRelationshipType.bind(userController));
router.put('/users/:id/sexual-orientation', userController.changeSexualOrientation.bind(userController));
router.put('/users/:id/smokes', userController.changeSmokes.bind(userController));
router.put('/users/:id/sports', userController.changeSports.bind(userController));
router.put('/users/:id/values-and-beliefs', userController.changeValuesAndBeliefs.bind(userController));
router.put('/users/:id/weight', userController.changeWeight.bind(userController));
router.post('/users/:id/photo', userController.uploadPhoto.bind(userController));
router.delete('/users/:id/photo', userController.deletePhoto.bind(userController));
router.post('/users/:id/report', userController.reportUser.bind(userController));

export default router;
