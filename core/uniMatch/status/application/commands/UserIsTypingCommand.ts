import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsTypingDTO } from "../DTO/UserIsTypingDTO";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { r } from "@faker-js/faker/dist/airline-BLb3y-7w";

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

            const targetStatus = await this.repository.findById(request.targetUserId);
            if (!targetStatus) {
                return Result.failure<string>(new NotFoundError('Target user not found'));
            }

            status.startTyping(request.targetUserId);
            await this.repository.update(status, status.userId);
            return Result.success(request.targetUserId);
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }
}