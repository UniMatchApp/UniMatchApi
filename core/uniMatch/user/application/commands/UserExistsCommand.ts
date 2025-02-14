import { ICommand } from "@/core/shared/application/ICommand";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";

export class UserExistsCommand implements ICommand<string, boolean> {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(userId: string): Promise<Result<boolean>> {
        try {
            const userExists = await this.repository.findById(userId);

            if (userExists) {
                return Result.success<boolean>(true);
            } else {
                return Result.success<boolean>(false);
            }
        } catch (error: any) {
            console.error(error);
            return Result.failure<boolean>(error);
        }
    }
}
