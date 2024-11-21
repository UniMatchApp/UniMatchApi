import { ICommand } from "@/core/shared/application/ICommand";
import { CreateNewUserDTO } from "../DTO/CreateNewUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { User } from "../../domain/User";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { IEmailNotifications } from '../../../../shared/application/IEmailNotifications';
import { IProfileRepository } from "../ports/IProfileRepository";
import { UserDTO } from "../DTO/UserDTO";

export class CreateNewUserCommand implements ICommand<CreateNewUserDTO, { token: string, user: UserDTO }> {
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

    async run(request: CreateNewUserDTO): Promise<Result<{ token: string, user: UserDTO }>> {
        try {
            const userExists = await this.repository.findByEmail(request.email);

            if (userExists){
                return Result.failure<{ token: string, user: UserDTO }>(new ValidationError(`User with email ${request.email} already exists`));
            }

            const user = new User(
                request.email,
                request.password
            );

            user.create();
            
            await this.repository.create(user);

            const code = user.generateVerificationCode();
            await this.emailNotifications.sendEmailToOne(
                user.email,
                "¡Hola, bienvenido a UniMatch!",
                `Habla ya con tus matches. Tu código de registre es: ${code}`
            );

            this.eventBus.publish(user.pullDomainEvents());
            const userDTO: UserDTO = {
                id: user.getId(),
                email: user.email,
                registered: user.registered,
                registrationDate: user.registrationDate,
                blockedUsers: user.blockedUsers,
                reportedUsers: user.reportedUsers.map(user => user.getId())
            }

            const token = "token";

            console.log("Código de eso: ", code);
            return Result.success<{ token: string, user: UserDTO }>({ token, user: userDTO });
        } catch (error : any) {
            return Result.failure<{ token: string, user: UserDTO }>(error);
        }
    }
}
