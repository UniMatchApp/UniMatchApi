import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsTypingDTO } from "../DTO/UserIsTypingDTO";
import { IStatusRepository } from "../ports/IStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class UserIsTypingCommand implements ICommand<UserIsTypingDTO, void> {
    private readonly repository: IStatusRepository;

    constructor(repository: IStatusRepository) {
        this.repository = repository;
    }

    async run(request: UserIsTypingDTO): Promise<Result<void>> {
        try {
            const status = await this.repository.findById(request.userId);
            if (!status) {
                return Result.failure<void>(new NotFoundError('User not found'));
            }
            status.startTyping(request.targetUserId);
            await this.repository.save(status);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}