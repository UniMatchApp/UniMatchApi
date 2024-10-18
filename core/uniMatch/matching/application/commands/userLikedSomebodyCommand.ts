import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserLikedSomebodyDTO } from "../DTO/UserLikedSomebodyDTO";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Like } from "../../domain/relations/Like";

export class UserLikedSomebodyCommand implements ICommand<UserLikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    run(request: UserLikedSomebodyDTO): Result<void> {
        try {
            const user = this.repository.findByUserId(request.userId);
            const likedUser = this.repository.findByUserId(request.likedUserId);

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