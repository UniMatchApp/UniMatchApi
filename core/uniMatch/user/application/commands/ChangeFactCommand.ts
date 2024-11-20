import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ChangeFactDTO } from "../DTO/ChangeFactDTO";

export class ChangeFactCommand implements ICommand<ChangeFactDTO, string> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeFactDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if(!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            console.log(request.newContent);
            
            profile.fact = request.newContent;
            console.log(profile.fact);
            await this.repository.update(profile, profile.getId());
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}