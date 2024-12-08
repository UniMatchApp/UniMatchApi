import {ICommand} from "@/core/shared/application/ICommand";
import {CreateNewUserDTO} from "../DTO/CreateNewUserDTO";
import {IUserRepository} from "../ports/IUserRepository";
import {Result} from "@/core/shared/domain/Result";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {User} from "../../domain/User";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";
import {IEmailNotifications} from '@/core/shared/application/IEmailNotifications';
import {IProfileRepository} from "../ports/IProfileRepository";
import {UserDTO} from "../DTO/UserDTO";

export class CreateNewUserCommand implements ICommand<CreateNewUserDTO, UserDTO> {
    private readonly repository: IUserRepository;
    private readonly profileRepository: IProfileRepository;
    private readonly eventBus: IEventBus;
    private readonly emailNotifications: IEmailNotifications;

    constructor(repository: IUserRepository, eventBus: IEventBus, emailNotifications: IEmailNotifications, profileRepository: IProfileRepository) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.emailNotifications = emailNotifications;
        this.profileRepository = profileRepository;
    }

    async run(request: CreateNewUserDTO): Promise<Result<UserDTO>> {
        try {
            const userExists = await this.repository.findByEmail(request.email);

            if (userExists) {
                return Result.failure<UserDTO>(new ValidationError(`User with email ${request.email} already exists`));
            }

            const user = new User(
                request.email,
                request.password
            );

            user.create();

            await this.repository.create(user);

            const code = user.generateVerificationCode();
            await this.emailNotifications.welcomeEmail(user.email, code);

            this.eventBus.publish(user.pullDomainEvents());
            const userDTO: UserDTO = {
                id: user.getId(),
                email: user.email,
                registered: user.registered,
                registrationDate: user.registrationDate,
                blockedUsers: user.blockedUsers,
                reportedUsers: user.reportedUsers.map(user => user.getId())
            }

            return Result.success<UserDTO>(userDTO);
        } catch (error: any) {
            console.error(error);
            return Result.failure<UserDTO>(error);
        }
    }
}
