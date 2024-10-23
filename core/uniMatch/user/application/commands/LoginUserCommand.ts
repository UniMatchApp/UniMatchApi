import { ICommand } from "@/core/shared/application/ICommand";
import { IUserRepository } from "../ports/IUserRepository";
import { Result } from "@/core/shared/domain/Result";
import { User } from "../../domain/User";
import { AuthenticationError } from "@/core/shared/exceptions/AuthenticationError";
import { LoginUserDTO } from "../DTO/LoginUserDTO";

export class LoginUserCommand implements ICommand<LoginUserDTO, User> {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: LoginUserDTO): Promise<Result<User>> {
        try {
            const user = await this.repository.findByEmail(request.email);

            if (!user) {
                return Result.failure<User>(new AuthenticationError(`User with email ${request.email} not found`));
            }

            if (request.password === "") {
                return Result.failure<User>(new AuthenticationError(`Password is required`));
            }

            if (user.password !== request.password) {
                return Result.failure<User>(new AuthenticationError(`Invalid password for email ${request.email}`));
            }

            return Result.success<User>(user);
        } catch (error: any) {
            return Result.failure<User>(error);
        }
    }
}
