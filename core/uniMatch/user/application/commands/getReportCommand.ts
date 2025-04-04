import { ICommand } from "@/core/shared/application/ICommand";
import { ReportUserDTO } from "../DTO/ReportUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { IReportedUserRepository } from "../ports/IReportedUserRepository";

export class GetReportCommand implements ICommand<string, ReportUserDTO[]> {
    private readonly repository: IReportedUserRepository;

    constructor(repository: IReportedUserRepository) {
        this.repository = repository;
    }

    async run(userId: string): Promise<Result<ReportUserDTO[]>> {
        try {
            const user = await this.repository.findById(userId);
            if (!user) {
                return Result.failure<ReportUserDTO[]>(new NotFoundError(`User with id ${userId} not found`));
            }
            
            const reports = await this.repository.getReportsByUserId(userId);
            return Result.success<ReportUserDTO[]>(reports);
        } catch (error: any) {
            return Result.failure<ReportUserDTO[]>(error);
        }
    }
}
