import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ChangeFactDTO } from "../DTO/ChangeFactDTO";

export class ChangeFactCommand implements ICommand<ChangeFactDTO, string | undefined> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeFactDTO): Promise<Result<string | undefined>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if(!profile) {
                return Result.failure<string | undefined>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
          
            profile.fact = request.newContent;

            await this.repository.update(profile, profile.getId());
            return Result.success<string | undefined>(request.newContent);
        } catch (error: any) {
            return Result.failure<string | undefined>(error);
        }
    }
}