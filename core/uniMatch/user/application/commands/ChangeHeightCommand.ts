import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeHeightDTO } from "../DTO/ChangeHeightDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeHeightCommand implements ICommand<ChangeHeightDTO, number | undefined> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeHeightDTO): Promise<Result<number | undefined>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<number | undefined>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            console.log(request);
            profile.height = request.newHeight;

            await this.repository.update(profile, profile.getId());

            return Result.success<number | undefined>(request.newHeight);
        
        } catch (error : any) {
            return Result.failure<number | undefined>(error);
        }
    }

}