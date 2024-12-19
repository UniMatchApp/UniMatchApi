import {ICommand} from "@/core/shared/application/ICommand";
import {BlockUserDTO} from "../DTO/BlockUserDTO";
import {Result} from "@/core/shared/domain/Result";
import {IUserRepository} from "../ports/IUserRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {DuplicateError} from "@/core/shared/exceptions/DuplicateError";

export class BlockUserCommand implements ICommand<BlockUserDTO, void> {
    
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: BlockUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.userId)
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.userId} not found`));
            }
            
            const userToBlock = await this.repository.findById(request.blockUserId)
            if (!userToBlock) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.blockUserId} not found`));
            }

            if(user.isUserBlocked(request.blockUserId)) {
                return Result.failure<void>(new DuplicateError(`User with id ${request.blockUserId} has been already blocked`));
            } 

            user.blockUser(request.blockUserId);

            await this.repository.update(user, user.getId());
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
