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
import {FileHandler} from "@/core/uniMatch/event/infrastructure/FileHandler";
import {UUID} from "@/core/shared/domain/UUID";
import {IProfileRepository} from "@/core/uniMatch/user/application/ports/IProfileRepository";

export class CreateNewProfileCommand implements ICommand<CreateNewProfileDTO, Profile> {
    private readonly userRepository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly fileHandler: IFileHandler;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, profileRepository: IProfileRepository,
                fileHandler: FileHandler, eventBus: IEventBus) {
        this.userRepository = repository;
        this.profileRepository = profileRepository;
        this.fileHandler = fileHandler;
        this.eventBus = eventBus;
    }

    async run(request: CreateNewProfileDTO): Promise<Result<Profile>> {
        try {
            // Check if the user already exists (email)
            const user = await this.userRepository.findByEmail(request.userId);

            if (!user) {
                return Result.failure<Profile>(new NotFoundError(`User with id ${request.userId} does not exist`));
            }

            const profileUrl = await this.fileHandler.save(UUID.generate().toString(), request.image);

            const profile = new Profile(
                request.userId,
                request.name,
                request.age,
                request.aboutMe,
                Gender.fromString(request.gender),
                new Location(request.location.latitude, request.location.longitude),
                new SexualOrientation(request.sexualOrientation),
                RelationshipType.fromString(request.relationshipType),
                request.birthday,
                request.interests,
                [profileUrl]
            )
            profile.preferredImage = profileUrl;

            profile.create();

            await this.profileRepository.create(profile);
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<Profile>(profile);
        } catch (error: any) {
            return Result.failure<Profile>(error);
        }
    }
}
