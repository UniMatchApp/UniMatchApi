import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { GetUserPotentialMatchesDTO } from "../DTO/GetUserPotentialMatchesDTO";

export class GetUserPotentialMatchesCommand implements ICommand<GetUserPotentialMatchesDTO, string[]> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(request: GetUserPotentialMatchesDTO): Promise<Result<string[]>> {
        try {
            const user = await this.repository.findByUserId(request.userId);

            if (!user) {
                return Result.failure<string[]>(new NotFoundError("User not found"));
            }
            console.log("user: ", user);    
            
            const potentialMatches = await this.repository.findPotentialMatches(request.userId, request.limit);
            console.log("potentialMatches: ", potentialMatches);
            if (potentialMatches.length === 0) {
                return Result.failure<string[]>(new NotFoundError("No potential matches found"));
            }

            return Result.success<string[]>(potentialMatches.map((node: Node) => node.userId));
        } catch (error: any) {
            console.error('Error getting potential matches:', error);
            return Result.failure<string[]>(error);
        }
    }
}
