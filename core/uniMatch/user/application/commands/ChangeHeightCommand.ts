import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeHeightDTO } from "../DTO/ChangeHeightDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeHeightCommand implements ICommand<ChangeHeightDTO, string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeHeightDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id)
            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.height = request.newHeight;

            await this.repository.update(profile, profile.getId());

            return Result.success<string>(request.newHeight.toString());
        
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }

}