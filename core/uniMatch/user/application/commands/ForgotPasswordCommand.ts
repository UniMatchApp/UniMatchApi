import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { forgotPasswordDTO } from "../DTO/ForgotPasswordDTO";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";

export class ForgotPasswordCommand implements ICommand<forgotPasswordDTO, String> {

    private readonly repository: IUserRepository;
    private readonly emailRepository: IEmailNotifications;

    constructor(repository: IUserRepository, emailRepository: IEmailNotifications) {
        this.repository = repository;
        this.emailRepository = emailRepository;
    }

    async run(request: forgotPasswordDTO): Promise<Result<String>> {
        try {
            const user = await this.repository.findByEmail(request.email);
            if (!user) {
                return Result.failure<String>(new NotFoundError(`User with email ${request.email} not found`));
            }

            const code = user.generateVerificationCode();
            this.emailRepository.sendEmailToOne(
                user.email,
                "UniMatch - Reset your password",
                `Your reset code is: ${code}`
            );

            return Result.success<String>(user.getId());
        } catch (error: any) {
            return Result.failure<String>(error);
        }
    }
}
