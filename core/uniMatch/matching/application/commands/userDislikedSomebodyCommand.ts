import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserDislikedSomebodyDTO } from "../DTO/UserDislikedSomebodyDTO";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Dislike } from "../../domain/relations/Dislike";

export class UserDislikedSomebodyCommand implements ICommand<UserDislikedSomebodyDTO, void> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    run(request: UserDislikedSomebodyDTO): Result<void> {
        try {
            const user = this.repository.findByUserId(request.userId);
            const dislikedUser = this.repository.findByUserId(request.dislikedUserId);

            if (!user) {
                throw new Error("User not found");
            }

            if (!dislikedUser) {
                throw new Error("Liked user not found");
            }

            const dislike = new Dislike(user, dislikedUser);
            user.addDislike(dislike);
            dislikedUser.addDislike(dislike);
            this.repository.save(user);
            this.repository.save(dislikedUser);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}