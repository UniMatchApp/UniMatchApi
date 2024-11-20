import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IUserRepository} from "../ports/IUserRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {VerifyCodeDTO} from "@/core/uniMatch/user/application/DTO/VerifyCodeDTO";
import {AuthenticationError} from "@/core/shared/exceptions/AuthenticationError";

export class VerifyCodeCommand implements ICommand<VerifyCodeDTO, void> {

    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository ) {
        this.repository = repository;
    }

    async run(request: VerifyCodeDTO): Promise<Result<null>> {
        try {
            const user = await this.repository.findByEmail(request.email);
            if (!user) {
                return Result.failure(new NotFoundError(`User with email ${request.email} not found`));
            }
            if (!user.validateVerificationCode(request.code)) {
                return Result.failure(new AuthenticationError(`Invalid code`));
            }
            return Result.success(null);
        } catch (error: any) {
            return Result.failure(error);
        }
    }
}
