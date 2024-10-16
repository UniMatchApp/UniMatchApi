import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UserHasDisconnectedDTO } from "../DTO/UserHasDisconnectedDTO";
import { IStatusRepository } from "../ports/IStatusRepository";

export class UserHasDisconnectedCommand implements ICommand<UserHasDisconnectedDTO, void> {
    private readonly repository: IStatusRepository;

    constructor(repository: IStatusRepository) {
        this.repository = repository;
    }

    run(request: UserHasDisconnectedDTO): Result<void> {
        try {
            this.repository.deleteById(request.userId);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}