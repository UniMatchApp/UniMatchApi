import { ICommand } from "@/core/shared/application/ICommand";
import { ReportUserDTO } from "../DTO/ReportUserDTO";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";

export class ReportUserCommand implements ICommand<ReportUserDTO, void> {
    
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: ReportUserDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findById(request.id)
            if (!user) {
                throw new Error(`User with id ${request.id} not found`);
            }
            
            const blockUser = await this.repository.findById(request.reportedUserId)
            if (!blockUser) {
                throw new Error(`User with id ${request.reportedUserId} not found`);
            }

            if(user.isUserBlocked(request.reportedUserId)) {
                throw new Error(`User with id ${request.reportedUserId} is already blocked`);
            } 

            user.reportUser(request.reportedUserId);

            await this.repository.save(user);
            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
