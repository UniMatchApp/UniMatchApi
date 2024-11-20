import {Request, Response} from 'express';
import {IProfileRepository} from '@/core/uniMatch/user/application/ports/IProfileRepository';
import {IUserRepository} from '@/core/uniMatch/user/application/ports/IUserRepository';
import {IEventBus} from '@/core/shared/application/IEventBus';
import { S3FileHandler } from "@/core/shared/infrastructure/S3FileHandler";
import {CreateNewUserCommand} from '@/core/uniMatch/user/application/commands/CreateNewUserCommand';
import {ErrorHandler} from '../../ErrorHandler';
import {User} from '@/core/uniMatch/user/domain/User';
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

export class UserController {
    private readonly userRepository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly emailNotifications: IEmailNotifications;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    constructor(
        userRepository: IUserRepository, 
        profileRepository: IProfileRepository, 
        emailNotifications: IEmailNotifications, 
        eventBus: IEventBus,
        fileHandler: IFileHandler
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.emailNotifications = emailNotifications;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const command = new CreateNewUserCommand(this.userRepository, this.eventBus, this.emailNotifications, this.profileRepository);
        return command.run(req.body).then((result: Result<{ token: string, user: UserDTO }>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
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
        const userId = req.params.id;
        const dto = {userId: userId, ...req.body} as CreateNewProfileDTO;
        return command.run(dto).then((result: Result<Profile>) => {
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
                console.log(result);
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const blockUserId = req.params.targetId;
        const command = new BlockUserCommand(this.userRepository);
        const dto = {userId: id, blockUserId: blockUserId} as BlockUserDTO;
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
        const id = req.params.id;
        const aboutMe = req.body.newContent;
        const command = new ChangeAboutMeCommand(this.profileRepository);
        const dto = {id: id, newContent: aboutMe} as ChangeAboutMeDTO;
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
        const id = req.params.id;
        const degree = req.body.newContent;
        const command = new ChangeDegreeCommand(this.profileRepository);
        const dto = {id: id, degree: degree} as ChangeDegreeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeFact(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const fact = req.body.newContent;
        const command = new ChangeFactCommand(this.profileRepository);
        const dto = {id: id, newContent: fact} as ChangeFactDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeDrinks(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const drinks = req.body.newContent;
        const command = new ChangeDrinksCommand(this.profileRepository);
        const dto = {id: id, newContent: drinks} as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeEmail(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const email = req.body.email;
        const command = new ChangeEmailCommand(this.userRepository, this.eventBus);
        const dto = {id: id, newEmail: email} as ChangeEmailDTO;
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
        const id = req.params.id;
        const height = req.body.height;
        const command = new ChangeHeightCommand(this.profileRepository);
        const dto = {id: id, newHeight: height} as ChangeHeightDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeHoroscope(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const horoscope = req.body.newContent;
        const command = new ChangeHoroscopeCommand(this.profileRepository);
        const dto = {id: id, newContent: horoscope} as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeInterests(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const interests = req.body.interests;
        const command = new ChangeInterestsCommand(this.profileRepository);
        const dto = {id: id, newInterests: interests} as ChangeIntereststDTO;
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
        const id = req.params.id;
        const job = req.body.newContent;
        const command = new ChangeJobCommand(this.profileRepository);
        const dto = {id: id, newContent: job} as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const password = req.body.password;
        const command = new ChangePasswordCommand(this.userRepository, this.eventBus);
        const dto = {id: id, newPassword: password} as ChangePasswordDTO;
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
        const id = req.params.id;
        const personality = req.body.newContent;
        const command = new ChangePersonalityCommand(this.profileRepository);
        const dto = {id: id, newContent: personality} as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePets(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const pets = req.body.newContent;
        const command = new ChangePetsCommand(this.profileRepository);
        const dto = {id: id, newContent: pets} as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeRelationshipType(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const relationshipType = req.body.newContent;
        const command = new ChangeRelationshipTypeCommand(this.profileRepository, this.eventBus);
        const dto = {id: id, relationshipType: relationshipType} as ChangeRelationshipTypeDTO;
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
        const id = req.params.id;
        const sexualOrientation = req.body.newContent;
        console.log("entro")
        const command = new ChangeSexualOrientationCommand(this.profileRepository, this.eventBus);
        const dto = {id: id, newSexualOrientation: sexualOrientation} as ChangeSexualOrientationDTO;
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
        const id = req.params.id;
        const gender = req.body.newContent;
        const command = new ChangeGenderCommand(this.profileRepository, this.eventBus);
        const dto = {id: id, newGender: gender} as ChangeGenderDTO;
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
        const id = req.params.id;
        const smokes = req.body.newContent;
        const command = new ChangeSmokesCommand(this.profileRepository);
        const dto = {id: id, newContent: smokes} as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeSports(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const sports = req.body.newContent;
        const command = new ChangeSportsCommand(this.profileRepository);
        const dto = {id: id, newContent: sports} as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeValuesAndBeliefs(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const valuesAndBeliefs = req.body.newContent;
        const command = new ChangeValuesAndBeliefsCommand(this.profileRepository);
        const dto = {id: id, newContent: valuesAndBeliefs} as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeWeight(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const weight = req.body.weight;
        const command = new ChangeWeightCommand(this.profileRepository);
        const dto = {id: id, newWeight: weight} as ChangeWeightDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async uploadPhoto(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const command = new UploadPhotoCommand(this.profileRepository, this.fileHandler);
        const dto = {userId: userId, ...req.body} as UploadPhotoDTO;
        return command.run(dto).then((result: Result<File>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deletePhoto(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
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
        const id = req.params.id;
        const targetId = req.params.targetId;
        const command = new ReportUserCommand(this.userRepository);
        const dto = {id: id, reportedUserId: targetId, ...req.body} as ReportUserDTO;
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
        return command.run(req.body).then((result: Result<{ token: string, user: UserDTO }>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

}