import { Router } from 'express';
import { UserController } from '../uniMatch/user/UserController';
import { eventBus } from '../Main';
import { UserRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/UserRepository';
import { ProfileRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/ProfileRepository';

const router = Router();
const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();
const userController = new UserController(userRepository, profileRepository, eventBus);

router.post('/:id/block/:targetId', userController.blockUser.bind(userController));
router.put('/:id/about', userController.changeAboutMe.bind(userController));
router.put('/:id/degree', userController.changeDegree.bind(userController));
router.put('/:id/drinks', userController.changeDrings.bind(userController));
router.put('/:id/email', userController.changeEmail.bind(userController));
router.put('/:id/height', userController.changeHeight.bind(userController));
router.put('/:id/horoscope', userController.changeHoroscope.bind(userController));
router.put('/:id/interests', userController.changeInterests.bind(userController));
router.put('/:id/job', userController.changeJob.bind(userController));
router.put('/:id/password', userController.changePassword.bind(userController));
router.put('/:id/personality', userController.changePersonality.bind(userController));
router.put('/:id/pets', userController.changePets.bind(userController));
router.put('/:id/relationship-type', userController.changeRelationshipType.bind(userController));
router.put('/:id/sexual-orientation', userController.changeSexualOrientation.bind(userController));
router.put('/:id/smokes', userController.changeSmokes.bind(userController));
router.put('/:id/sports', userController.changeSports.bind(userController));
router.put('/:id/values-and-beliefs', userController.changeValuesAndBeliefs.bind(userController));
router.put('/:id/weight', userController.changeWeight.bind(userController));
router.post('/:id', userController.createProfile.bind(userController));
router.post('', userController.createUser.bind(userController));
router.delete('/:id/deletePhoto/:photoUrl', userController.deletePhoto.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.get('/:id', userController.getProfile.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/:id/report', userController.reportUser.bind(userController));
router.post('/:id/photo', userController.uploadPhoto.bind(userController));


export { router };
