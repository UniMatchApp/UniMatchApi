import {ICommand} from "@/core/shared/application/ICommand";
import {IUserRepository} from "../ports/IUserRepository";
import {Result} from "@/core/shared/domain/Result";
import {AuthenticationError} from "@/core/shared/exceptions/AuthenticationError";
import {LoginUserDTO} from "../DTO/LoginUserDTO";
import {IEmailNotifications} from "@/core/shared/application/IEmailNotifications";
import {UserDTO} from "@/core/uniMatch/user/application/DTO/UserDTO";
import {User} from "@/core/uniMatch/user/domain/User";

export class LoginUserCommand implements ICommand<LoginUserDTO, { token: string, user: UserDTO }> {
    private readonly repository: IUserRepository;
    private readonly emailRepository: IEmailNotifications;

    constructor(repository: IUserRepository, emailRepository: IEmailNotifications) {
        this.repository = repository;
        this.emailRepository = emailRepository;
    }

    async run(request: LoginUserDTO): Promise<Result<{ token: string, user: UserDTO }>> {
        try {
            const user: User | null = await this.repository.findByEmail(request.email);

            if (!user) {
                return Result.failure<{
                    token: string,
                    user: UserDTO
                }>(new AuthenticationError(`User with email ${request.email} not found`));
            }

            if (request.password === "") {
                return Result.failure<{
                    token: string,
                    user: UserDTO
                }>(new AuthenticationError(`Password is required`));
            }

            if (user.password !== request.password) {
                return Result.failure<{
                    token: string,
                    user: UserDTO
                }>(new AuthenticationError(`Invalid password for email ${request.email}`));
            }


            if (!user.registered) {
                const code = user.generateVerificationCode();
                this.emailRepository.sendEmailToOne(
                    user.email,
                    "UniMatch - Confirm your login",
                    `Your confirmation code is: ${code}`
                );
            }

            // TODO: Implement JWT token generation
            return Result.success<{ token: string, user: UserDTO }>(
                {
                    token: "token",
                    user: {
                        id: user.getId(),
                        email: user.email,
                        blockedUsers: user.blockedUsers,
                        reportedUsers: user.reportedUsers.map(r => r.userId),
                        registrationDate: user.registrationDate,
                        registered: user.registered
                    }
                }
            );
        } catch (error: any) {
            return Result.failure<{ token: string, user: UserDTO }>(error);
        }
    }
}
