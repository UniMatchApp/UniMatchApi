import {Request, Response} from 'express';
import {IProfileRepository} from '@/core/uniMatch/user/application/ports/IProfileRepository';
import {IUserRepository} from '@/core/uniMatch/user/application/ports/IUserRepository';
import {IEventBus} from '@/core/shared/application/IEventBus';
import {CreateNewUserCommand} from '@/core/uniMatch/user/application/commands/CreateNewUserCommand';
import {ErrorHandler} from '../../utils/ErrorHandler';
import {Result} from '@/core/shared/domain/Result';
import {DeleteUserCommand} from '@/core/uniMatch/user/application/commands/DeleteUserCommand';
import {DeleteUserDTO} from '@/core/uniMatch/user/application/DTO/DeleteUserDTO';
import {BlockUserCommand} from '@/core/uniMatch/user/application/commands/BlockUserCommand';
import {BlockUserDTO} from '@/core/uniMatch/user/application/DTO/BlockUserDTO';
import {ChangeAboutMeCommand} from '@/core/uniMatch/user/application/commands/ChangeAboutMeCommand';
import {ChangeAboutMeDTO} from '@/core/uniMatch/user/application/DTO/ChangeAboutMeDTO';
import {ChangeDegreeCommand} from '@/core/uniMatch/user/application/commands/ChangeDegreeCommand';
import {ChangeDegreeDTO} from '@/core/uniMatch/user/application/DTO/ChangeDegreeDTO';
import {ChangeDrinksCommand} from '@/core/uniMatch/user/application/commands/ChangeDrinksCommand';
import {ChangeLifeStyleDTO} from '@/core/uniMatch/user/application/DTO/ChangeLifestyleDTO';
import {ChangeEmailCommand} from '@/core/uniMatch/user/application/commands/ChangeEmailCommand';
import {ChangeEmailDTO} from '@/core/uniMatch/user/application/DTO/ChangeEmailDTO';
import {ChangeHeightCommand} from '@/core/uniMatch/user/application/commands/ChangeHeightCommand';
import {ChangeHeightDTO} from '@/core/uniMatch/user/application/DTO/ChangeHeightDTO';
import {ChangeHoroscopeCommand} from '@/core/uniMatch/user/application/commands/ChangeHoroscopeCommand';
import {ChangeMoreAboutMeDTO} from '@/core/uniMatch/user/application/DTO/ChangeMoreAboutMeDTO';
import {ChangeInterestsCommand} from '@/core/uniMatch/user/application/commands/ChangeInterestsCommand';
import {ChangeIntereststDTO} from '@/core/uniMatch/user/application/DTO/ChangeInterestsDTO';
import {ChangeJobCommand} from '@/core/uniMatch/user/application/commands/ChangeJobCommand';
import {ChangePasswordCommand} from '@/core/uniMatch/user/application/commands/ChangePasswordCommand';
import {ChangePasswordDTO} from '@/core/uniMatch/user/application/DTO/ChangePasswordDTO';
import {ChangePersonalityCommand} from '@/core/uniMatch/user/application/commands/ChangePersonalityCommand';
import {ChangePetsCommand} from '@/core/uniMatch/user/application/commands/ChangePetsCommand';
import {ChangeRelationshipTypeCommand} from '@/core/uniMatch/user/application/commands/ChangeRelationshipTypeCommand';
import {ChangeRelationshipTypeDTO} from '@/core/uniMatch/user/application/DTO/ChangeRelationshipTypeDTO';
import {ChangeSexualOrientationCommand} from '@/core/uniMatch/user/application/commands/ChangeSexualOrientationCommand';
import {ChangeSexualOrientationDTO} from '@/core/uniMatch/user/application/DTO/ChangeSexualOrientationDTO';
import {ChangeSmokesCommand} from '@/core/uniMatch/user/application/commands/ChangeSmokesCommand';
import {ChangeSportsCommand} from '@/core/uniMatch/user/application/commands/ChangeSportsCommand';
import {ChangeValuesAndBeliefsCommand} from '@/core/uniMatch/user/application/commands/ChangeValuesAndBeliefsCommand';
import {ChangeWeightDTO} from '@/core/uniMatch/user/application/DTO/ChangeWeightDTO';
import {ChangeWeightCommand} from '@/core/uniMatch/user/application/commands/ChangeWeightCommand';
import {UploadPhotoCommand} from '@/core/uniMatch/user/application/commands/UploadPhotoCommand';
import {UploadPhotoDTO} from '@/core/uniMatch/user/application/DTO/UploadPhotoDTO';
import {DeletePhotoFromTheWallCommand} from '@/core/uniMatch/user/application/commands/DeletePhotoFromTheWallCommand';
import {DeletePhotoFromTheWallDTO} from '@/core/uniMatch/user/application/DTO/DeletePhotoFromTheWallDTO';
import {ReportUserCommand} from '@/core/uniMatch/user/application/commands/ReportUserCommand';
import {ReportUserDTO} from '@/core/uniMatch/user/application/DTO/ReportUserDTO';
import {LoginUserCommand} from '@/core/uniMatch/user/application/commands/LoginUserCommand';
import {CreateNewProfileCommand} from '@/core/uniMatch/user/application/commands/CreateNewProfileCommand';
import {Profile} from '@/core/uniMatch/user/domain/Profile';
import {CreateNewProfileDTO} from '@/core/uniMatch/user/application/DTO/CreateNewProfileDTO';
import {GetProfileCommand} from '@/core/uniMatch/user/application/commands/GetProfileCommand';
import {GetProfileDTO} from '@/core/uniMatch/user/application/DTO/GetProfileDTO';
import {IEmailNotifications} from "@/core/shared/application/IEmailNotifications";
import {ForgotPasswordCommand} from '@/core/uniMatch/user/application/commands/ForgotPasswordCommand';
import {ResendCodeCommand} from '@/core/uniMatch/user/application/commands/ResendCodeCommand';
import {VerifyCodeCommand} from "@/core/uniMatch/user/application/commands/VerifyCodeCommand";
import {VerifyCodeDTO} from "@/core/uniMatch/user/application/DTO/VerifyCodeDTO";
import { forgotPasswordDTO } from '@/core/uniMatch/user/application/DTO/ForgotPasswordDTO';
import { IFileHandler } from '@/core/shared/application/IFileHandler';
import { UserDTO } from '@/core/uniMatch/user/application/DTO/UserDTO';
import { ProfileDTO } from '@/core/uniMatch/user/application/DTO/ProfileDTO';
import { ChangeFactCommand } from '@/core/uniMatch/user/application/commands/ChangeFactCommand';
import { ChangeFactDTO } from '@/core/uniMatch/user/application/DTO/ChangeFactDTO';
import { ChangeGenderDTO } from '@/core/uniMatch/user/application/DTO/ChangeGenderDTO';
import { ChangeGenderCommand } from '@/core/uniMatch/user/application/commands/ChangeGenderCommand';
import { ChangeWallCommand } from '@/core/uniMatch/user/application/commands/ChangeWallCommand';
import { ChangeWallDTO } from '@/core/uniMatch/user/application/DTO/ChangeWallDTO';
import { TokenService } from '../../utils/TokenService';
import { ChangeGenderPriorityCommand } from '@/core/uniMatch/user/application/commands/ChangeGenderPriorityCommand';
import { ChangeGenderPriorityDTO } from '@/core/uniMatch/user/application/DTO/ChangeGenderPriorityDTO';
import { ChangeAgeRangeCommand } from '@/core/uniMatch/user/application/commands/ChangeAgeRangeCommand';
import { ChangeAgeRangeDTO } from '@/core/uniMatch/user/application/DTO/ChangeAgeRangeDTO';
import { ChangeMaxDistanceCommand } from '@/core/uniMatch/user/application/commands/ChangeMaxDistanceCommand';
import { ChangeMaxDistanceDTO } from '@/core/uniMatch/user/application/DTO/ChangeMaxDistanceDTO';
import { ChangeLocationDTO } from '@/core/uniMatch/user/application/DTO/ChangeLocationDTO';
import { ChangeLocationCommand } from '@/core/uniMatch/user/application/commands/ChangeLocationCommand';
import {ChangeDrinksDTO} from '@/core/uniMatch/user/application/DTO/ChangeDrinksDTO';
import { ChangeHoroscopeDTO } from '@/core/uniMatch/user/application/DTO/ChangeHoroscopeDTO';
import { ChangeJobDTO } from '@/core/uniMatch/user/application/DTO/ChangeJobDTO';
import { ChangePersonalityDTO } from '@/core/uniMatch/user/application/DTO/ChangePersonalityDTO';
import { ChangePetsDTO } from '@/core/uniMatch/user/application/DTO/ChangePetsDTO';
import { ChangeSmokesDTO } from '@/core/uniMatch/user/application/DTO/ChangeSmokesDTO';
import { ChangeSportsDTO } from '@/core/uniMatch/user/application/DTO/ChangeSportsDTO';
import { ChangeValuesAndBeliefsDTO } from '@/core/uniMatch/user/application/DTO/ChangeValuesAndBeliefsDTO';

export class UserController {
    private readonly userRepository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly emailNotifications: IEmailNotifications;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;
    private readonly tokenService: TokenService;

    constructor(
        userRepository: IUserRepository, 
        profileRepository: IProfileRepository, 
        emailNotifications: IEmailNotifications, 
        eventBus: IEventBus,
        fileHandler: IFileHandler,
        tokenService: TokenService
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.emailNotifications = emailNotifications;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
        this.tokenService = tokenService
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const command = new CreateNewUserCommand(this.userRepository, this.eventBus, this.emailNotifications, this.profileRepository);
        return command.run(req.body).then((result: Result<UserDTO>) => {
            if (result.isSuccess()) {
                const user = result.getValue();
                if (user) {
                    const token = this.tokenService.generateToken({ id: user.id });
                    const newResult = Result.success<{user: UserDTO, token: string}>({ token: token, user: user });
                    res.json(newResult);
                } else {
                    ErrorHandler.handleError(new Error("User not found"), res);
                }
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = req.body.userId;
        const command = new DeleteUserCommand(this.userRepository, this.profileRepository, this.eventBus);
        const dto = {userId: id} as DeleteUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async createProfile(req: Request, res: Response): Promise<void> {
        const command = new CreateNewProfileCommand(this.userRepository, this.profileRepository, this.fileHandler, this.eventBus);
        return command.run(req.body).then((result: Result<Profile>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const query = new GetProfileCommand(this.profileRepository);
        const dto = {id: id} as GetProfileDTO;
        return query.run(dto).then((result: Result<ProfileDTO>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const blockUserId = req.params.targetId;
        const command = new BlockUserCommand(this.userRepository);
        const dto = {userId: userId, blockUserId: blockUserId} as BlockUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const email = req.params.email;
        const command = new ForgotPasswordCommand(this.userRepository, this.emailNotifications);
        const dto = {email: email} as forgotPasswordDTO;
        return command.run(dto).then((result: Result<String>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async resendCode(req: Request, res: Response): Promise<void> {
        const command = new ResendCodeCommand(this.userRepository, this.emailNotifications);
        return command.run(req.body).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async verifyCode(req: Request, res: Response): Promise<void> {
        const command = new VerifyCodeCommand(this.userRepository);
        const {email, code} = req.params;
        const dto = {email: email as string, code: code as string} as VerifyCodeDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeAboutMe(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const aboutMe = req.body.newContent;
        const command = new ChangeAboutMeCommand(this.profileRepository);
        const dto = {id: userId, newContent: aboutMe} as ChangeAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
            

    async changeDegree(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const degree = req.body.newContent;
        const command = new ChangeDegreeCommand(this.profileRepository);
        const dto = {id: userId, degree: degree} as ChangeDegreeDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeLocation(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const altitude = req.body.altitude;
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;
        const command = new ChangeLocationCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, altitude: altitude, longitude: longitude, latitude: latitude} as ChangeLocationDTO;
        return command.run(dto).then((result: Result<{latitude?: number, longitude?: number, altitude?: number}>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeFact(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const fact = req.body.newContent;
        const command = new ChangeFactCommand(this.profileRepository);
        const dto = {id: userId, newContent: fact} as ChangeFactDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeDrinks(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const drinks = req.body.newContent;
        const command = new ChangeDrinksCommand(this.profileRepository);
        const dto = {id: userId, newContent: drinks} as ChangeDrinksDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeEmail(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const email = req.body.email;
        const command = new ChangeEmailCommand(this.userRepository, this.eventBus);
        const dto = {id: userId, newEmail: email} as ChangeEmailDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeHeight(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const height = req.body.newContent;
        const command = new ChangeHeightCommand(this.profileRepository);
        const dto = {id: userId, newHeight: height} as ChangeHeightDTO;
        return command.run(dto).then((result: Result<number | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeHoroscope(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const horoscope = req.body.newContent;
        const command = new ChangeHoroscopeCommand(this.profileRepository);
        const dto = {id: userId, newContent: horoscope} as ChangeHoroscopeDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeInterests(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const interests = req.body.newContent;
        const command = new ChangeInterestsCommand(this.profileRepository);
        const dto = {id: userId, newInterests: interests} as ChangeIntereststDTO;
        return command.run(dto).then((result: Result<string[] | string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeJob(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const job = req.body.newContent;
        const command = new ChangeJobCommand(this.profileRepository);
        const dto = {id: userId, newContent: job} as ChangeJobDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId || req.params.id;
        const password = req.body.password;
        const command = new ChangePasswordCommand(this.userRepository, this.eventBus);
        const dto = {id: userId, newPassword: password} as ChangePasswordDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePersonality(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const personality = req.body.newContent;
        const command = new ChangePersonalityCommand(this.profileRepository);
        const dto = {id: userId, newContent: personality} as ChangePersonalityDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePets(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const pets = req.body.newContent;
        const command = new ChangePetsCommand(this.profileRepository);
        const dto = {id: userId, newContent: pets} as ChangePetsDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeRelationshipType(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const relationshipType = req.body.newContent;
        const command = new ChangeRelationshipTypeCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, relationshipType: relationshipType} as ChangeRelationshipTypeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeSexualOrientation(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const sexualOrientation = req.body.newContent;
        const command = new ChangeSexualOrientationCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, newSexualOrientation: sexualOrientation} as ChangeSexualOrientationDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeGender(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const gender = req.body.newContent;
        const command = new ChangeGenderCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, newGender: gender} as ChangeGenderDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }


    async changeSmokes(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const smokes = req.body.newContent;
        const command = new ChangeSmokesCommand(this.profileRepository);
        const dto = {id: userId, newContent: smokes} as ChangeSmokesDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeSports(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const sports = req.body.newContent;
        const command = new ChangeSportsCommand(this.profileRepository);
        const dto = {id: userId, newContent: sports} as ChangeSportsDTO;
        return command.run(dto).then((result: Result<string |undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeValuesAndBeliefs(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const valuesAndBeliefs = req.body.newContent;
        const command = new ChangeValuesAndBeliefsCommand(this.profileRepository);
        const dto = {id: userId, newContent: valuesAndBeliefs} as ChangeValuesAndBeliefsDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeGenderPriority(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId
        const newGender = req.body.newContent;
        const command = new ChangeGenderPriorityCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, newGender: newGender} as ChangeGenderPriorityDTO;
        return command.run(dto).then((result: Result<string | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeAgeRange(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const min = req.body.min;
        const max = req.body.max;
        const command = new ChangeAgeRangeCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, min: min, max: max} as ChangeAgeRangeDTO;
        return command.run(dto).then((result: Result<{min: number, max: number}>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeMaxDistance(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const distance = req.body.newContent;
        const command = new ChangeMaxDistanceCommand(this.profileRepository, this.eventBus);
        const dto = {id: userId, distance: distance} as ChangeMaxDistanceDTO;
        return command.run(dto).then((result: Result<number>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeWeight(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const weight = req.body.newContent;
        const command = new ChangeWeightCommand(this.profileRepository);
        const dto = {id: userId, newWeight: weight} as ChangeWeightDTO;
        return command.run(dto).then((result: Result<number | undefined>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeWall(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const command = new ChangeWallCommand(this.profileRepository);
        const dto = {id: userId, ...req.body} as ChangeWallDTO;
        return command.run(dto).then((result: Result<string[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async uploadPhoto(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const command = new UploadPhotoCommand(this.profileRepository, this.fileHandler);
        const dto = {userId: userId, ...req.body} as UploadPhotoDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }


    async deletePhoto(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const photoURL = req.params.photoUrl;
        const command = new DeletePhotoFromTheWallCommand(this.profileRepository, this.fileHandler);
        const dto = {userId: userId, photoURL: photoURL} as DeletePhotoFromTheWallDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async reportUser(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const targetId = req.params.targetId;
        const command = new ReportUserCommand(this.userRepository);
        const dto = {id: userId, reportedUserId: targetId, ...req.body} as ReportUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async login(req: Request, res: Response): Promise<void> {
        const command = new LoginUserCommand(this.userRepository, this.emailNotifications);
        return command.run(req.body).then((result: Result<UserDTO>) => {
            if (result.isSuccess()) {
                const user = result.getValue();
                if (user) {
                    const token = this.tokenService.generateToken({id: user.id});
                    const newResult = Result.success<{user: UserDTO, token: string}>({user: user, token: token});
                    res.json(newResult);
                } else {
                    ErrorHandler.handleError(new Error("User not found"), res);
                }
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

}