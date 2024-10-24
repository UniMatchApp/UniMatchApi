import { ICommand } from "@/core/shared/application/ICommand";
import { CreateNewUserDTO } from "../DTO/CreateNewUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { User } from "../../domain/User";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";
import { IEmailNotifications } from '../../../../shared/application/IEmailNotifications';

export class CreateNewUserCommand implements ICommand<CreateNewUserDTO, User> {
    private readonly repository: IUserRepository;
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
                "Welcome to UniMatch!",
                `Welcome to UniMatch! Your registration code is: ${user.code}`
            );

            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<User>(user);
        } catch (error : any) {
            return Result.failure<User>(error);
        }
    }
}
