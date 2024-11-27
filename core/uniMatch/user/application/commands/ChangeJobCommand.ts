import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeMoreAboutMeDTO } from "../DTO/ChangeMoreAboutMeDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeJobCommand implements ICommand<ChangeMoreAboutMeDTO, string | undefined> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeMoreAboutMeDTO): Promise<Result<string | undefined>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if(!profile) {
                return Result.failure<string | undefined>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            profile.job = request.newContent;
            console.log("request job: ", profile.job);
            await this.repository.update(profile, profile.getId());
            return Result.success<string | undefined>(request.newContent);
        } catch (error: any) {
            console.log(error);
            return Result.failure<string | undefined>(error);
        }
    }
}