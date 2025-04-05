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
            const reports = await this.repository.findAll();

            if (!reports) {
                console.log("No reports found");
                return Result.failure<ReportUserDTO[]>(new NotFoundError(`No reports found`));
            }

            const reportsDTO: ReportUserDTO[] = reports.map(report => ({
                id: report.getId().toString(),
                reportedUserId: report.userId,
                predefinedReason: report.predefinedReason,
                details: report.details,
                comment: report.comment,
                createdAt: report.timestamp,
            }));

            console.log("Reports hechos: ", reports);
            return Result.success<ReportUserDTO[]>(reportsDTO);
        } catch (error: any) {
            return Result.failure<ReportUserDTO[]>(error);
        }
    }
}
