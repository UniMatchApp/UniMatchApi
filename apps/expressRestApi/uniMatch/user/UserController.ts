import { Request, Response } from 'express';
import { IProfileRepository } from '@/core/uniMatch/user/application/ports/IProfileRepository';
import { IUserRepository } from '@/core/uniMatch/user/application/ports/IUserRepository';
import { IEventBus } from '@/core/shared/application/IEventBus';
import { FileHandler } from '@/core/uniMatch/event/infrastructure/FileHandler';
import { CreateNewUserCommand } from '@/core/uniMatch/user/application/commands/CreateNewUserCommand';
import { CreateNewUserDTO } from '@/core/uniMatch/user/application/DTO/CreateNewUserDTO';
import { ErrorHandler } from '../../ErrorHandler';
import { User } from '@/core/uniMatch/user/domain/User';
import { Result } from '@/core/shared/domain/Result';
import { DeleteUserCommand } from '@/core/uniMatch/user/application/commands/DeleteUserCommand';
import { DeleteUserDTO } from '@/core/uniMatch/user/application/DTO/DeleteUserDTO';
import { BlockUserCommand } from '@/core/uniMatch/user/application/commands/BlockUserCommand';
import { BlockUserDTO } from '@/core/uniMatch/user/application/DTO/BlockUserDTO';
import { ChangeAboutMeCommand } from '@/core/uniMatch/user/application/commands/ChangeAboutMeCommand';
import { ChangeAboutMeDTO } from '@/core/uniMatch/user/application/DTO/ChangeAboutMeDTO';
import { ChangeDegreeCommand } from '@/core/uniMatch/user/application/commands/ChangeDegreeCommand';
import { ChangeDegreeDTO } from '@/core/uniMatch/user/application/DTO/ChangeDegreeDTO';
import { ChangeDrinksCommand } from '@/core/uniMatch/user/application/commands/ChangeDrinksCommand';
import { ChangeLifeStyleDTO } from '@/core/uniMatch/user/application/DTO/ChangeLifestyleDTO';
import { ChangeEmailCommand } from '@/core/uniMatch/user/application/commands/ChangeEmailCommand';
import { ChangeEmailDTO } from '@/core/uniMatch/user/application/DTO/ChangeEmailDTO';
import { ChangeHeightCommand } from '@/core/uniMatch/user/application/commands/ChangeHeightCommand';
import { ChangeHeightDTO } from '@/core/uniMatch/user/application/DTO/ChangeHeightDTO';
import { ChangeHoroscopeCommand } from '@/core/uniMatch/user/application/commands/ChangeHoroscopeCommand';
import { ChangeMoreAboutMeDTO } from '@/core/uniMatch/user/application/DTO/ChangeMoreAboutMeDTO';
import { ChangeInterestsCommand } from '@/core/uniMatch/user/application/commands/ChangeInterestsCommand';
import { ChangeIntereststDTO } from '@/core/uniMatch/user/application/DTO/ChangeInterestsDTO';
import { ChangeJobCommand } from '@/core/uniMatch/user/application/commands/ChangeJobCommand';
import { ChangePasswordCommand } from '@/core/uniMatch/user/application/commands/ChangePasswordCommand';
import { ChangePasswordDTO } from '@/core/uniMatch/user/application/DTO/ChangePasswordDTO';
import { ChangePersonalityCommand } from '@/core/uniMatch/user/application/commands/ChangePersonalityCommand';
import { ChangePetsCommand } from '@/core/uniMatch/user/application/commands/ChangePetsCommand';
import { ChangeRelationshipTypeCommand } from '@/core/uniMatch/user/application/commands/ChangeRelationshipTypeCommand';
import { ChangeRelationshipTypeDTO } from '@/core/uniMatch/user/application/DTO/ChangeRelationshipTypeDTO';
import { ChangeSexualOrientationCommand } from '@/core/uniMatch/user/application/commands/ChangeSexualOrientationCommand';
import { ChangeSexualOrientationDTO } from '@/core/uniMatch/user/application/DTO/ChangeSexualOrientationDTO';
import { ChangeSmokesCommand } from '@/core/uniMatch/user/application/commands/ChangeSmokesCommand';
import { ChangeSportsCommand } from '@/core/uniMatch/user/application/commands/ChangeSportsCommand';
import { ChangeValuesAndBeliefsCommand } from '@/core/uniMatch/user/application/commands/ChangeValuesAndBeliefsCommand';
import { ChangeWeightDTO } from '@/core/uniMatch/user/application/DTO/ChangeWeightDTO';
import { ChangeWeightCommand } from '@/core/uniMatch/user/application/commands/ChangeWeightCommand';
import { CreateNewProfileCommand } from '@/core/uniMatch/user/application/commands/CreateNewProfileCommand';
import { CreateNewProfileDTO } from '@/core/uniMatch/user/application/DTO/CreateNewProfileDTO';
import { UploadPhotoCommand } from '@/core/uniMatch/user/application/commands/UploadPhotoCommand';
import { UploadPhotoDTO } from '@/core/uniMatch/user/application/DTO/UploadPhotoDTO';
import { DeletePhotoFromTheWallCommand } from '@/core/uniMatch/user/application/commands/DeletePhotoFromTheWallCommand';
import { DeletePhotoFromTheWallDTO } from '@/core/uniMatch/user/application/DTO/DeletePhotoFromTheWallDTO';
import { ReportUserCommand } from '@/core/uniMatch/user/application/commands/ReportUserCommand';
import { ReportUserDTO } from '@/core/uniMatch/user/application/DTO/ReportUserDTO';

export class UserController {
    private readonly userRepository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: FileHandler;

    constructor(userRepository: IUserRepository, profileRepository: IProfileRepository, eventBus: IEventBus) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.eventBus = eventBus;
        this.fileHandler = new FileHandler();
    }

    // Create y delete user crearán y eliminarán el perfil asociado al usuario??? 
    async createUser(req: Request, res: Response): Promise<void> {
        var command = new CreateNewUserCommand(this.userRepository, this.eventBus);
        var dto = req.body as CreateNewUserDTO;
        return command.run(dto).then((result: Result<User>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var command = new DeleteUserCommand(this.userRepository, this.eventBus);
        var dto = { userId: id } as DeleteUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var blockUserId = req.body.blockUserId;
        var command = new BlockUserCommand(this.userRepository);
        var dto = { userId: id, blockUserId: blockUserId} as BlockUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeAboutMe(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var aboutMe = req.body.aboutMe;
        var command = new ChangeAboutMeCommand(this.profileRepository);
        var dto = { id: id, newContent: aboutMe } as ChangeAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeDegree(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var degree = req.body.degree;
        var command = new ChangeDegreeCommand(this.profileRepository);
        var dto = { id: id, degree: degree } as ChangeDegreeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeDrings(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var drinks = req.body.drinks;
        var command = new ChangeDrinksCommand(this.profileRepository);
        var dto = { id: id, newContent: drinks } as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeEmail(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var email = req.body.email;
        var command = new ChangeEmailCommand(this.userRepository, this.eventBus);
        var dto = { id: id, newEmail: email } as ChangeEmailDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeHeight(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var height = req.body.height;
        var command = new ChangeHeightCommand(this.profileRepository);
        var dto = { id: id, newHeight: height } as ChangeHeightDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeHoroscope(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var horoscope = req.body.horoscope;
        var command = new ChangeHoroscopeCommand(this.profileRepository);
        var dto = { id: id, newContent: horoscope } as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeInterests(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var interests = req.body.interests;
        var command = new ChangeInterestsCommand(this.profileRepository);
        var dto = { id: id, newInterests: interests } as ChangeIntereststDTO;
        return command.run(dto).then((result: Result<string[] | string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeJob(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var job = req.body.job;
        var command = new ChangeJobCommand(this.profileRepository);
        var dto = { id: id, newContent: job } as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var password = req.body.password;
        var command = new ChangePasswordCommand(this.userRepository, this.eventBus);
        var dto = { id: id, newPassword: password } as ChangePasswordDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changePersonality(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var personality = req.body.personality;
        var command = new ChangePersonalityCommand(this.profileRepository);
        var dto = { id: id, newContent: personality } as ChangeMoreAboutMeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
    
    async changePets(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var pets = req.body.pets;
        var command = new ChangePetsCommand(this.profileRepository);
        var dto = { id: id, newContent: pets } as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeRelationshipType(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var relationshipType = req.body.relationshipType;
        var command = new ChangeRelationshipTypeCommand(this.profileRepository, this.eventBus);
        var dto = { id: id, relationshipType: relationshipType } as ChangeRelationshipTypeDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeSexualOrientation(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var sexualOrientation = req.body.sexualOrientation;
        var command = new ChangeSexualOrientationCommand(this.profileRepository, this.eventBus);
        var dto = { id: id, newSexualOrientation: sexualOrientation } as ChangeSexualOrientationDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async changeSmokes(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var smokes = req.body.smokes;
        var command = new ChangeSmokesCommand(this.profileRepository);
        var dto = { id: id, newContent: smokes } as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });       
    }

    async changeSports(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var sports = req.body.sports;
        var command = new ChangeSportsCommand(this.profileRepository);
        var dto = { id: id, newContent: sports } as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });       
    }

    async changeValuesAndBeliefs(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var valuesAndBeliefs = req.body.valuesAndBeliefs;
        var command = new ChangeValuesAndBeliefsCommand(this.profileRepository);
        var dto = { id: id, newContent: valuesAndBeliefs } as ChangeLifeStyleDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });       
    }
    
    async changeWeight(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var weight = req.body.weight;
        var command = new ChangeWeightCommand(this.profileRepository);
        var dto = { id: id, newWeight: weight } as ChangeWeightDTO;
        return command.run(dto).then((result: Result<string>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });       
    }

    async uploadPhoto(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var photo = req.body.photo;
        var command = new UploadPhotoCommand(this.profileRepository, this.fileHandler);
        var dto = { id: id, photo: photo } as UploadPhotoDTO;
        return command.run(dto).then((result: Result<File>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
    
    async deletePhoto(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var photoURL = req.body.photoURL;
        var command = new DeletePhotoFromTheWallCommand(this.profileRepository, this.fileHandler);
        var dto = { id: id, photoURL: photoURL } as DeletePhotoFromTheWallDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
    
    async reportUser(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var command = new ReportUserCommand(this.userRepository);
        var dto = { id: id, ...req.body } as ReportUserDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    

}