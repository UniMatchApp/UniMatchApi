import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeIntereststDTO } from "../DTO/ChangeInterestsDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ChangeInterestsCommand implements ICommand<ChangeIntereststDTO, string[]> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeIntereststDTO): Promise<Result<string[]>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<string[]>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            console.log(request);
            profile.interests = request.newInterests;

            await this.repository.update(profile, profile.getId());

            return Result.success<string[]>(profile.interests);
        
        } catch (error : any) {
            return Result.failure<string[]>(error);
        }
    }

}