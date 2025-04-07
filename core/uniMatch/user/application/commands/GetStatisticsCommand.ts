import { ICommand } from "@/core/shared/application/ICommand";
import { StatisticsDTO } from "../DTO/StatisticsDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Result } from "@/core/shared/domain/Result";


export class GetStatisticsCommand implements ICommand<void, StatisticsDTO[]> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: void): Promise<Result<StatisticsDTO[]>> {
        try {
            const statistics = await this.repository.getStatistics();

            return Result.success<StatisticsDTO[]>(statistics);
        } catch (error: any) {
            return Result.failure<StatisticsDTO[]>(error);
        }
    }
}