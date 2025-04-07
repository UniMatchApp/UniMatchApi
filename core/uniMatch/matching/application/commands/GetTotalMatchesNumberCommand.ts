import { ICommand } from "@/core/shared/application/ICommand";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Result } from "@/core/shared/domain/Result";


export class GetTotalMatchesNumberCommand implements ICommand<void, number> {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async run(request: void): Promise<Result<number>> {
        try {
            const totalMatches = await this.repository.getTotalMatchesNumber();
            return Result.success<number>(totalMatches);
        } catch (error: any) {
            return Result.failure<number>(error);
        }
    }
}