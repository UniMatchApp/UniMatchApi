import { ICommand } from "@/core/shared/application/ICommand";
import { ReportUserDTO } from "../DTO/ReportUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { IReportedUserRepository } from "../ports/IReportedUserRepository";

export class GetAllReportsCommand implements ICommand<string, ReportUserDTO[]> {
    private readonly repository: IReportedUserRepository;

    constructor(repository: IReportedUserRepository) {
        this.repository = repository;
    }

    async run(): Promise<Result<ReportUserDTO[]>> {
        try { 
            const reports = await this.repository.getReports();
            console.log("Reports hechos: ", reports);
            return Result.success<ReportUserDTO[]>(reports);
        } catch (error: any) {
            return Result.failure<ReportUserDTO[]>(error);
        }
    }
}
