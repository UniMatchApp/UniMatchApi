import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Dislike } from "../../domain/relations/Dislike";
import { UserDislikedSomebodyDTO } from "../DTO/userDislikedSomebodyDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

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
            user.addDislike(dislike);
            dislikedUser.addDislike(dislike);
            await this.repository.save(user);
            await this.repository.save(dislikedUser);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}