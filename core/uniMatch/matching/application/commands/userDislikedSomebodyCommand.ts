import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {Dislike} from "@/core/uniMatch/matching/domain/relations/Dislike";
import {UserDislikedSomebodyDTO} from "@/core/uniMatch/matching/application/DTO/userDislikedSomebodyDTO";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";

export class UserDislikedSomebodyCommand implements ICommand<UserDislikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
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

            const dislike = new Dislike(user, dislikedUser);
            await this.repository.dislikeUser(dislike);
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}