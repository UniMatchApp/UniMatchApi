import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeEmailDTO } from "../DTO/ChangeEmailDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class ChangeEmailCommand implements ICommand<ChangeEmailDTO, string> {
    
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeEmailDTO): Promise<Result<string>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                throw new Error(`User with id ${request.id} not found`);
            }
            
            const email = user.email;
            if (request.newEmail === email) {
                throw new Error("New email is the same as the old one");
            }

            user.email = request.newEmail;

            await this.repository.save(user);

            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<string>(request.newEmail);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}