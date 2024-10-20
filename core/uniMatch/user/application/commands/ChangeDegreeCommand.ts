import { ICommand } from "@/core/shared/application/ICommand";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Result } from "@/core/shared/domain/Result";
import { ChangeDegreeDTO } from "../DTO/ChangeDegreeDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeDegreeCommand implements ICommand<ChangeDegreeDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeDegreeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id);
            if(!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            profile.education = request.degree;
            await this.repository.update(profile, profile.getId());
            return Result.success<string>(request.degree);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}