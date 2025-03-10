import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { GetUserPotentialMatchesDTO } from "../DTO/GetUserPotentialMatchesDTO";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { GetRandomUserMatchesDTO } from "../DTO/GetRandomUserMatchesDTO";

export class GetRandomUserMatchesCommand implements ICommand<GetRandomUserMatchesDTO, string> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(request: GetRandomUserMatchesDTO): Promise<Result<string>> {
        try {
            console.log('Getting potential matches for user:', request.userId);
            const user = await this.repository.findByUserId(request.userId);

            if (!user) {
                return Result.failure<string>(new NotFoundError("User not found"));
            }

            const potentialMatch = await this.repository.findRandomPotentialMatch(request.userId);

            if (!potentialMatch) {
                return Result.failure<string>(new NotFoundError("No potential match found"));
            }

            return Result.success<string>(potentialMatch.map((node: Node) => node.userId)[0]);
        } catch (error: any) {
            console.error('Error getting potential matches:', error);
            return Result.failure<string>(error);
        }
    }
}
