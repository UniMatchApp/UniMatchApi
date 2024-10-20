import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangePasswordDTO } from "../DTO/ChangePasswordDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { DuplicateError } from "@/core/shared/exceptions/DuplicateError";

export class ChangePasswordCommand implements ICommand<ChangePasswordDTO, string> {

    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangePasswordDTO): Promise<Result<string>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                return Result.failure<string>(new NotFoundError(`User with id ${request.id} not found`));
            }
            
            const password = user.password;
            if (request.newPassword === password) {
                return Result.failure<string>(new DuplicateError(`New password is the same as the current password`));
            }

            user.password = request.newPassword;

            await this.repository.update(user, user.getId());

            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<string>(request.newPassword);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}