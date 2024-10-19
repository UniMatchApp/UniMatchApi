import { ICommand } from "@/core/shared/application/ICommand";
import { BlockUserDTO } from "../DTO/BlockUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class BlockUserCommand implements ICommand<BlockUserDTO, void> {
    
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: BlockUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                throw new Error(`User with id ${request.id} not found`);
            }
            
            const blockUser = await this.repository.findById(request.blockedUserId)
            if (!blockUser) {
                throw new Error(`User with id ${request.blockedUserId} not found`);
            }

            if(user.isUserBlocked(request.blockedUserId)) {
                throw new Error(`User with id ${request.blockedUserId} is already blocked`);
            } 

            user.blockUser(request.blockedUserId);

            await this.repository.save(user);
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
