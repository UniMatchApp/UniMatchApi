import { ICommand } from "@/core/shared/application/ICommand";
import { ReportUserDTO } from "../DTO/ReportUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { DuplicateError } from "@/core/shared/exceptions/DuplicateError";
import { ReportedUser } from "../../domain/ReportedUser";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IReportedUserRepository } from "../ports/IReportedUserRepository";

export class ReportUserCommand implements ICommand<ReportUserDTO, void> {
    
    private readonly repository: IUserRepository;
    private readonly reportedRepository: IReportedUserRepository;

    constructor(repository: IUserRepository, reportedRepository: IReportedUserRepository) {
        this.repository = repository;
        this.reportedRepository = reportedRepository;
    }

    async run(request: ReportUserDTO): Promise<Result<void>> {
        try {
            console.log(`ReportUserCommand: ${JSON.stringify(request)}`);
            const user = await this.repository.findById(request.id)
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.id} not found`));
            }
            
            const userToReport = await this.repository.findById(request.reportedUserId)
            if (!userToReport) {
                console.log(`User with id ${request.reportedUserId} not found`);
                return Result.failure<void>(new NotFoundError(`User with id ${request.reportedUserId} not found`));
            }

            if(userToReport.isUserBlocked(request.reportedUserId)) {
                return Result.failure<void>(new DuplicateError(`User with id ${request.reportedUserId} is already blocked`));
            } 
            const reportedUser = new ReportedUser(request.reportedUserId, request.predefinedReason, request.details, request.comment);
            reportedUser.setId(request.id);

            user.blockUser(request.reportedUserId);
            user.reportUser(reportedUser);

            await this.repository.update(user, user.getId());

            await this.reportedRepository.create(reportedUser);

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
