import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Dislike } from "../../domain/relations/Dislike";
import { UserDislikedSomebodyDTO } from "../DTO/userDislikedSomebodyDTO";

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
                throw new Error("User not found");
            }

            if (!dislikedUser) {
                throw new Error("Liked user not found");
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