import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { UserLikedSomebodyDTO } from "../DTO/userLikedSomebodyDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { IEventBus } from "@/core/shared/application/IEventBus";

export class UserLikedSomebodyCommand implements ICommand<UserLikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IMatchingRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: UserLikedSomebodyDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findByUserId(request.userId);
            const likedUser = await this.repository.findByUserId(request.likedUserId);

            if (!user) {
                return Result.failure<void>(new NotFoundError("User not found"));
            }

            if (!likedUser) {
                return Result.failure<void>(new NotFoundError("Liked user not found"));
            }

            const like = user.like(likedUser);
            await this.repository.likeUser(like);
            this.eventBus.publish(user.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}