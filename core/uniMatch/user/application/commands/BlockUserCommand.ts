import { ICommand } from "@/core/shared/application/ICommand";
import { BlockUserDTO } from "../DTO/BlockUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { DuplicateError } from "@/core/shared/exceptions/DuplicateError";

export class BlockUserCommand implements ICommand<BlockUserDTO, void> {
    
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: BlockUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.id} not found`));
            }
            
            const blockUser = await this.repository.findById(request.blockedUserId)
            if (!blockUser) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.id} not found`));
            }

            if(user.isUserBlocked(request.blockedUserId)) {
                return Result.failure<void>(new DuplicateError(`User with id ${request.id} has been already blocked`));
            } 

            user.blockUser(request.blockedUserId);

            await this.repository.save(user);
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
