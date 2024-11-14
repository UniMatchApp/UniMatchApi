import { ICommand } from "@/core/shared/application/ICommand";
import { CreateNewUserDTO } from "../DTO/CreateNewUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { User } from "../../domain/User";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { IEmailNotifications } from '../../../../shared/application/IEmailNotifications';
import { IProfileRepository } from "../ports/IProfileRepository";

export class CreateNewUserCommand implements ICommand<CreateNewUserDTO, User> {
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

    async run(request: CreateNewUserDTO): Promise<Result<User>> {
        try {
            const userExists = await this.repository.findByEmail(request.email);

            if (userExists) {
                const profileExists = await this.profileRepository.findByUserId(userExists.getId().toString());
                
                if (!profileExists && !userExists.registered) {
                    
                    userExists.updateVerificationCode();
                    await this.repository.update(userExists, userExists.getId());
                    this.emailNotifications.sendEmailToOne(
                        userExists.email,
                        "UniMatch - Confirm your email",
                        `Your confirmation code is: ${userExists.code}`
                    );
                    return Result.success<User>(userExists);
                } else {
                    return Result.failure<User>(new ValidationError(`User with email ${request.email} already exists`));
                }
            }

            const user = new User(
                request.dateOfCreation,
                request.email,
                request.password
            );

            user.create();
            
            await this.repository.create(user);

            await this.emailNotifications.sendEmailToOne(
                user.email,
                "¡Hola, bienvenido a UniMatch!",
                `Habla ya con tus matches. Tu código de registre es: ${user.code}`
            );

            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<User>(user);
        } catch (error : any) {
            return Result.failure<User>(error);
        }
    }
}
