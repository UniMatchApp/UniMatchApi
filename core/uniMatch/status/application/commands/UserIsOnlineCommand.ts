import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserIsOnlineDTO } from "../DTO/UserIsOnlineDTO";
import { IStatusRepository } from "../ports/IStatusRepository";
import { Status } from "../../domain/Status";
import { ChatStatusEnum } from "../../domain/enum/ChatStatusEnum";


export class UserIsOnlineCommand implements ICommand<UserIsOnlineDTO, void> {
    private readonly repository: IStatusRepository;

    constructor(repository: IStatusRepository) {
        this.repository = repository;
    }

    run(request: UserIsOnlineDTO): Result<void> {
        try {
            const status = new Status(request.userId, ChatStatusEnum.ONLINE);
            this.repository.save(status);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}

