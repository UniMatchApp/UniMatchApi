import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangePasswordDTO } from "../DTO/ChangePasswordDTO";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class ChangePasswordCommand implements ICommand<ChangePasswordDTO, string> {

    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    run(request: ChangePasswordDTO): Result<string> {
        try {
            const user = this.repository.findById(request.id)
            if (!user) {
                throw new Error(`User with id ${request.id} not found`);
            }
            
            const password = user.password;
            if (request.newPassword === password) {
                throw new Error("New password cannot be the same as the old one");
            }

            user.password = request.newPassword;

            this.repository.save(user);

            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<string>(request.newPassword);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}