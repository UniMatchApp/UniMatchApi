import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { GetUsersWithMutualLikesDTO } from "../DTO/GetUsersWithMutualLikesDTO";

export class GetUsersWithMutualLikesCommand implements ICommand<{ userId: string }, Node[]> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(request: GetUsersWithMutualLikesDTO): Promise<Result<Node[]>> {
        try {
            const user = await this.repository.findByUserId(request.userId);

            if (!user) {
                return Result.failure<Node[]>(new NotFoundError("User not found"));
            }

            const mutualLikes = await this.repository.findMutualLikes(request.userId);
            return Result.success<Node[]>(mutualLikes);
        } catch (error: any) {
            return Result.failure<Node[]>(error);
        }
    }
}
