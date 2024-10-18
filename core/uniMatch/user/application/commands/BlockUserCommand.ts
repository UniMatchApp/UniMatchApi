import { ICommand } from "@/core/shared/application/ICommand";
import { BlockUserDTO } from "../DTO/BlockUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { User } from "../../domain/User";

export class BlockUserCommand implements ICommand<BlockUserDTO, void> {
    
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    run(request: BlockUserDTO): Result<void> {
        try {
            const user = this.repository.findById(request.id)
            if (!user) {
                throw new Error(`User with id ${request.id} not found`);
            }
            
            const blockUser = this.repository.findById(request.blockedUserId)
            if (!blockUser) {
                throw new Error(`User with id ${request.blockedUserId} not found`);
            }

            if(user.isUserBlocked(request.blockedUserId)) {
                throw new Error(`User with id ${request.blockedUserId} is already blocked`);
            } 

            user.blockUser(request.blockedUserId);

            this.repository.save(user);
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
