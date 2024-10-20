import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsTypingDTO } from "../DTO/UserIsTypingDTO";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class UserIsTypingCommand implements ICommand<UserIsTypingDTO, void> {
    private readonly repository: ISessionStatusRepository;

    constructor(repository: ISessionStatusRepository) {
        this.repository = repository;
    }

    async run(request: UserIsTypingDTO): Promise<Result<void>> {
        try {
            const status = await this.repository.findById(request.userId);
            if (!status) {
                return Result.failure<void>(new NotFoundError('User not found'));
            }
            status.startTyping(request.targetUserId);
            await this.repository.update(status, status.userId);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}