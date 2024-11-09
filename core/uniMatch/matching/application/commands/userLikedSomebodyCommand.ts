import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Like } from "../../domain/relations/Like";
import { UserLikedSomebodyDTO } from "../DTO/userLikedSomebodyDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class UserLikedSomebodyCommand implements ICommand<UserLikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
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

            const like = new Like(user, likedUser);
            await this.repository.likeUser(like);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}