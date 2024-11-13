import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { GetUserPotentialMatchesDTO } from "../DTO/GetUserPotentialMatchesDTO";

export class GetUserPotentialMatchesCommand implements ICommand<{ userId: string, limit: number }, Node[]> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(request: GetUserPotentialMatchesDTO): Promise<Result<Node[]>> {
        try {
            const user = await this.repository.findByUserId(request.userId);

            if (!user) {
                return Result.failure<Node[]>(new NotFoundError("User not found"));
            }

            const potentialMatches = await this.repository.findPotentialMatches(request.userId, request.limit);

            if (potentialMatches.length === 0) {
                return Result.failure<Node[]>(new NotFoundError("No potential matches found"));
            }

            return Result.success<Node[]>(potentialMatches);
        } catch (error: any) {
            return Result.failure<Node[]>(error);
        }
    }
}
