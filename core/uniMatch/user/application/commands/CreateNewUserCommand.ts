import { ICommand } from "@/core/shared/application/ICommand";
import { CreateNewUserDTO } from "../DTO/CreateNewUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { User } from "../../domain/User";

export class CreateNewEventCommand implements ICommand<CreateNewUserDTO, User> {
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;
    
    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: CreateNewUserDTO): Promise<Result<User>> {
        try {
            const user = new User(request.code, request.dateOfCreation, request.email, request.password);
            
            await this.repository.save(user);
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<User>(user);
        } catch (error : any) {
            return Result.failure<User>(error);
        }
    }
}
