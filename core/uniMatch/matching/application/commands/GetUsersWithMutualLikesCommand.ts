import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMatchingRepository} from "../ports/IMatchingRepository";
import {Node} from "../../domain/Node";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {GetUsersWithMutualLikesDTO} from "../DTO/GetUsersWithMutualLikesDTO";

export class GetUsersWithMutualLikesCommand implements ICommand<GetUsersWithMutualLikesDTO, string[]> {
    private readonly matchingRepository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.matchingRepository = repository;
    }

    async run(request: GetUsersWithMutualLikesDTO): Promise<Result<string[]>> {
        try {
            const user: Node | undefined = await this.matchingRepository.findByUserId(request.userId);

            if (!user) {
                return Result.failure<string[]>(new NotFoundError("User not found"));
            }

            const mutualLikes = await this.matchingRepository.findMutualLikes(request.userId);

            return Result.success<string[]>(mutualLikes.map((node: Node) => node.userId));
        } catch (error: any) {
            console.error(error);
            return Result.failure<string[]>(error);
        }
    }
}
