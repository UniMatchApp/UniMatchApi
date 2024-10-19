import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
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

    async run(request: DeleteUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.id)
            if(!user) {
                throw new Error(`User with id ${request.id} not found`);
            }

            user.delete();

            await this.repository.deleteById(request.id);
            
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}