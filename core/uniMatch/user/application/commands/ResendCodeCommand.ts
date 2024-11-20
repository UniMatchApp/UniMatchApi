import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IUserRepository } from "../ports/IUserRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";
import { ResendCodeDTO } from "../DTO/ResendCodeDTO";

export class ResendCodeCommand implements ICommand<ResendCodeDTO, void> {

    private readonly repository: IUserRepository;
    private readonly emailRepository: IEmailNotifications;

    constructor(repository: IUserRepository, emailRepository: IEmailNotifications) {
        this.repository = repository;
        this.emailRepository = emailRepository;
    }

    async run(request: ResendCodeDTO): Promise<Result<void>> {
        try {
            const user = await this.repository.findByEmail(request.email);
            if (!user) {
                return Result.failure<void>(new NotFoundError(`User with email ${request.email} not found`));
            }

            const code = user.generateVerificationCode();
            this.emailRepository.sendEmailToOne(
                user.email,
                "UniMatch - Resended code",
                `Your confirmation code is: ${code}`
            );

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
