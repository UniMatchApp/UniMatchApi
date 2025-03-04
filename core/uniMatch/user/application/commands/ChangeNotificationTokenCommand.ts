import { ICommand } from "@/core/shared/application/ICommand";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { ChangeNotificationTokenDTO } from "../DTO/ChangeNotificationTokenDTO";

export class ChangeNotificationTokenCommand implements ICommand<ChangeNotificationTokenDTO, void> {
    private readonly repository: IUserRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IUserRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeNotificationTokenDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.userId);

            if (!user) {
                return Result.failure<void>(new ValidationError(`User with ID ${request.userId} not found`));
            }

            if (user.notificationToken === request.notificationToken) {
                return Result.success<void>(undefined);
            }

            user.notificationToken = request.notificationToken;

            await this.repository.update(user, user.getId());

            this.eventBus.publish(user.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error: any) {
            console.error(error);
            return Result.failure<void>(error);
        }
    }
}
