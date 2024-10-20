import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsOnlineDTO } from "../DTO/UserIsOnlineDTO";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { SessionStatus } from "../../domain/SessionStatus";
import { ChatStatusEnum } from "../../domain/enum/ChatStatusEnum";


export class UserIsOnlineCommand implements ICommand<UserIsOnlineDTO, void> {
    private readonly repository: ISessionStatusRepository;

    constructor(repository: ISessionStatusRepository) {
        this.repository = repository;
    }

    async run(request: UserIsOnlineDTO): Promise<Result<void>> {
        try {
            const status = new SessionStatus(request.userId, ChatStatusEnum.ONLINE);
            await this.repository.create(status);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}

