import {ICommand} from "@/core/shared/application/ICommand";
import {IUserRepository} from "../ports/IUserRepository";
import {Result} from "@/core/shared/domain/Result";
import {User} from "../../domain/User";
import {AuthenticationError} from "@/core/shared/exceptions/AuthenticationError";
import {LoginUserDTO} from "../DTO/LoginUserDTO";

export class LoginUserCommand implements ICommand<LoginUserDTO, { token: string, user: User }> {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async run(request: LoginUserDTO): Promise<Result<{ token: string, user: User }>> {
        try {
            console.log("LoginUserCommand: ", request)
            const user = await this.repository.findByEmail(request.email);

            if (!user) {
                return Result.failure<{
                    token: string,
                    user: User
                }>(new AuthenticationError(`User with email ${request.email} not found`));
            }

            if (request.password === "") {
                return Result.failure<{ token: string, user: User }>(new AuthenticationError(`Password is required`));
            }

            if (user.password !== request.password) {
                return Result.failure<{
                    token: string,
                    user: User
                }>(new AuthenticationError(`Invalid password for email ${request.email}`));
            }

            // TODO: Implement JWT token generation
            return Result.success<{ token: string, user: User }>(
                {token: "token", user: user}
            );
        } catch (error: any) {
            return Result.failure<{ token: string, user: User }>(error);
        }
    }
}
