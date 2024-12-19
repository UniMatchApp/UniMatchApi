import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { UserHasStoppedTypingDTO } from "../DTO/UserHasStoppedTypingDTO";

export class UserHasStoppedTypingCommand implements ICommand<UserHasStoppedTypingDTO, string> {
    private readonly repository: ISessionStatusRepository;

    constructor(repository: ISessionStatusRepository) {
        this.repository = repository;
    }

    async run(request: UserHasStoppedTypingDTO): Promise<Result<string>> {
        try {
            const status = await this.repository.findById(request.userId);
            if (!status) {
                return Result.failure<string>(new NotFoundError('User not found'));
            }
            const targetId = status.targetUser;

            if (!targetId) {
                return Result.failure<string>(new NotFoundError('Target user not found'));
            }

            status.stopTyping();
            await this.repository.update(status, status.userId);
            return Result.success(targetId);
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }
}