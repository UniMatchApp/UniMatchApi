import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { forgotPasswordDTO } from "../DTO/ForgotPasswordDTO";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";

export class ForgotPasswordCommand implements ICommand<forgotPasswordDTO, void> {

    private readonly repository: IUserRepository;
    private readonly emailRepository: IEmailNotifications;

    constructor(repository: IUserRepository, emailRepository: IEmailNotifications) {
        this.repository = repository;
        this.emailRepository = emailRepository;
    }

    async run(request: forgotPasswordDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findByEmail(request.email);
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with email ${request.email} not found`));
            }

            user.updateVerificationCode();
            await this.repository.update(user, user.getId());
            this.emailRepository.sendEmailToOne(
                user.email,
                "UniMatch - Reset your password",
                `Your reset code is: ${user.code}`
            );

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
