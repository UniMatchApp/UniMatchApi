import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMatchingRepository} from "../ports/IMatchingRepository";

export class GetUsersThatLikeUserCommand implements ICommand<string, string[]> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(userId: string): Promise<Result<string[]>> {
        try {
            const usersThatLikeUser = await this.repository.findUsersThatLikeUser(userId);
            return Result.success(
                usersThatLikeUser.map(user => user.userId)
            );

        } catch (error: any) {
            return Result.failure<[]>(error);
        }
    }
}