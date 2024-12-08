import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {UserDislikedSomebodyDTO} from "@/core/uniMatch/matching/application/DTO/userDislikedSomebodyDTO";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class UserDislikedSomebodyCommand implements ICommand<UserDislikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IMatchingRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: UserDislikedSomebodyDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findByUserId(request.userId);
            const dislikedUser = await this.repository.findByUserId(request.dislikedUserId);

            if (!user) {
                return Result.failure<void>(new NotFoundError("User not found"));
            }

            if (!dislikedUser) {
                return Result.failure<void>(new NotFoundError("Disliked user not found"));
            }

            const dislike = user.dislike(dislikedUser);
            await this.repository.dislikeUser(dislike);
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error: any) {
            console.error(error);
            return Result.failure<void>(error);
        }
    }
}