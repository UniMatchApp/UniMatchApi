import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeleteUserDTO } from "../DTO/DeleteUserDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { IProfileRepository } from "../ports/IProfileRepository";


export class DeleteUserCommand implements ICommand<DeleteUserDTO, void> {
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;
    private readonly profileRepository: IProfileRepository;
    
    constructor(repository: IUserRepository, profileRepository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.profileRepository = profileRepository;
        this.eventBus = eventBus;
    }

    async run(request: DeleteUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.userId)
            if(!user) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.userId} not found`));
            }

            await this.repository.deleteById(request.userId); // Optional: could just do soft delete

            user.delete();

            

            const profile = await this.profileRepository.findByUserId(request.userId);
            if(profile) {
                await this.profileRepository.deleteById(profile.getId().toString());
            }
            
            
        
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error : any) {
            console.log(error);
            return Result.failure<void>(error);
        }
    }
}