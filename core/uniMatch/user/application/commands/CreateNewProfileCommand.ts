import {ICommand} from "@/core/shared/application/ICommand";
import {IUserRepository} from "../ports/IUserRepository";
import {Result} from "@/core/shared/domain/Result";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {CreateNewProfileDTO} from "@/core/uniMatch/user/application/DTO/CreateNewProfileDTO";
import {Profile} from "@/core/uniMatch/user/domain/Profile";
import {Gender} from "@/core/shared/domain/Gender";
import {Location} from "@/core/shared/domain/Location";
import {SexualOrientation} from "@/core/uniMatch/user/domain/SexualOrientation";
import {RelationshipType} from "@/core/shared/domain/RelationshipType";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {UUID} from "@/core/shared/domain/UUID";
import {IProfileRepository} from "@/core/uniMatch/user/application/ports/IProfileRepository";
import { AuthenticationError } from "@/core/shared/exceptions/AuthenticationError";

export class CreateNewProfileCommand implements ICommand<CreateNewProfileDTO, Profile> {
    private readonly userRepository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly fileHandler: IFileHandler;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, profileRepository: IProfileRepository,fileHandler: IFileHandler, eventBus: IEventBus) {
        this.userRepository = repository;
        this.profileRepository = profileRepository;
        this.fileHandler = fileHandler;
        this.eventBus = eventBus;
    }

    async run(request: CreateNewProfileDTO): Promise<Result<Profile>> {
        try {
            console.log("Request", request);
            const user = await this.userRepository.findById(request.userId);

            if (!user) {
                return Result.failure<Profile>(new NotFoundError(`User with id ${request.userId} does not exist`));
            }

            if (user.registered) {
                return Result.failure<Profile>(new AuthenticationError(`User with id ${request.userId} has already registered`));
            }

            const profileUrl = await this.fileHandler.save(UUID.generate().toString(), request.attachment);

            console.log("ProfileUrl", profileUrl);

            console.log("Location request", request.latitude);
            const location = request.latitude && request.longitude  ? new Location(request.latitude, request.longitude) : undefined
 
            console.log("Location", location);
            const profile = new Profile(
                request.userId,
                request.name,
                request.age,
                request.aboutMe,
                new Gender(Gender.fromString(request.gender)),
                new SexualOrientation(SexualOrientation.fromString(request.sexualOrientation)),
                RelationshipType.fromString(request.relationshipType),
                request.birthday,
                [],
                [profileUrl],
                location
            )
            profile.preferredImage = profileUrl;

            user.completeRegistration();
            
            await this.profileRepository.create(profile);
            await this.userRepository.update(user, user.getId());

            this.eventBus.publish(user.pullDomainEvents());
            this.eventBus.publish(profile.pullDomainEvents())
            console.log("Events bus", this.eventBus)
            return Result.success<Profile>(profile);
        } catch (error: any) {
            console.log(error);
            return Result.failure<Profile>(error);
        }
    }
}
