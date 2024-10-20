import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeMoreAboutMeDTO } from "../DTO/ChangeMoreAboutMeDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeJobCommand implements ICommand<ChangeMoreAboutMeDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeMoreAboutMeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id);
            if(!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            profile.job = request.newContent;
            await this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}