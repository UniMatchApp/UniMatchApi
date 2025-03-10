import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { UserIsSearchingRandomDTO } from "../DTO/UserIsSearchingRandomDTO";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class UserHasStoppedTypingCommand implements ICommand<UserIsSearchingRandomDTO, string> {
    private readonly repository: ISessionStatusRepository;
    private eventBus: IEventBus;

    constructor(repository: ISessionStatusRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: UserIsSearchingRandomDTO): Promise<Result<string>> {
        try {
            const status = await this.repository.findById(request.userId);
            if (!status) {
                return Result.failure<string>(new NotFoundError('User not found'));
            }

            status.stopFindingRandom();
            await this.repository.update(status, status.userId);

            this.eventBus.publish(status.pullDomainEvents());

            return Result.success(request.userId);
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }
}
