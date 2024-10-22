import { ICommand } from "@/core/shared/application/ICommand";
import { ReportUserDTO } from "../DTO/ReportUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { DuplicateError } from "@/core/shared/exceptions/DuplicateError";
import { ReportedUser } from "../../domain/ReportedUser";

export class ReportUserCommand implements ICommand<ReportUserDTO, void> {
    
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: ReportUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.id} not found`));
            }
            
            const userToReport = await this.repository.findById(request.reportedUserId)
            if (!userToReport) {
                return Result.failure<void>(new NotFoundError(`User with id ${request.reportedUserId} not found`));
            }

            if(userToReport.isUserBlocked(request.reportedUserId)) {
                return Result.failure<void>(new DuplicateError(`User with id ${request.reportedUserId} is already blocked`));
            } 
            const reportedUser = new ReportedUser(request.reportedUserId, request.predefinedReason, request.comment);
            userToReport.reportUser(reportedUser);
            user.blockUser(userToReport.getId());

            await this.repository.update(user, user.getId());
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
