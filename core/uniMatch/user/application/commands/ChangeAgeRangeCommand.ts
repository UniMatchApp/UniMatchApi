import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ChangeAgeRangeDTO } from "../DTO/ChangeAgeRangeDTO";

export class ChangeAgeRangeCommand implements ICommand<ChangeAgeRangeDTO, {min: number, max: number}> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeAgeRangeDTO): Promise<Result<{min: number, max: number}>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<{min: number, max: number}>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.ageRange = [request.min, request.max];

            await this.repository.update(profile, profile.getId());

            return Result.success<{min: number, max: number}>({min: request.min, max: request.max});
        
        } catch (error : any) {
            return Result.failure<{min: number, max: number}>(error);
        }
    }

}