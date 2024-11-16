import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsTypingDTO } from "../DTO/UserIsTypingDTO";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class UserIsTypingCommand implements ICommand<UserIsTypingDTO, string> {
    private readonly repository: ISessionStatusRepository;

    constructor(repository: ISessionStatusRepository) {
        this.repository = repository;
    }

    async run(request: UserIsTypingDTO): Promise<Result<string>> {
        try {
            const status = await this.repository.findById(request.userId);
            if (!status) {
                return Result.failure<string>(new NotFoundError('User not found'));
            }

            const targetId = status.targetUser;
            if (!targetId) {
                return Result.failure<string>(new NotFoundError('Target user not found'));
            }

            status.startTyping(request.targetUserId);
            await this.repository.update(status, status.userId);
            return Result.success(targetId);
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }
}