import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { userLikedSomebodyDTO } from "../DTO/userLikedSomebodyDTO";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Like } from "../../domain/relations/Like";

export class userLikedSomebodyCommand implements ICommand<userLikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    run(request: userLikedSomebodyDTO): Result<void> {
        try {
            const user = this.repository.findById(request.userId);
            const likedUser = this.repository.findById(request.likedUserId);

            if (!user) {
                throw new Error("User not found");
            }

            if (!likedUser) {
                throw new Error("Liked user not found");
            }

            const like = new Like(user, likedUser);
            user.addLike(like);
            likedUser.addLike(like);
            this.repository.save(user);
            this.repository.save(likedUser);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}