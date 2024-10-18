import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { User } from "../../domain/User";
import { DeleteUserDTO } from "../DTO/DeleteUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";


export class DeletUserCommand implements ICommand<DeleteUserDTO, void> {
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;
    
    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    run(request: DeleteUserDTO): Result<void> {
        try {
            const user = this.repository.findById(request.id)
            if(!user) {
                throw new Error(`User with id ${request.id} not found`);
            }

            user.delete();

            this.repository.deleteById(request.id);
            
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}