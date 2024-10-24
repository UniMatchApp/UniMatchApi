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
    
    constructor(repository: IUserRepository, eventBus: IEventBus, emailNotifications: IEmailNotifications) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.emailNotifications = emailNotifications;
    }

    async run(request: CreateNewUserDTO): Promise<Result<User>> {
        try {
            // Check if the user already exists (email)
            const userExists = await this.repository.findByEmail(request.email);

            if (userExists) {
                const profileExists = await this.profileRepository.findByUserId(userExists.getId().toString());
                
                if (!profileExists && !userExists.registered) {
                    await this.emailNotifications.sendEmailToOne(
                        userExists.email,
                        "Reenvío de código de verificación - UniMatch",
                        `Tu código de verificación es: ${userExists.code}`
                    );
                    return Result.success<User>(userExists);
                }

                return Result.failure<User>(new ValidationError(`User with email ${request.email} already exists`));
            }

            if (userExists) {
                return Result.failure<User>(new ValidationError(`User with email ${request.email} already exists`));
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
