import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeIntereststDTO } from "../DTO/ChangeInterestsDTO";

export class UpdateWeightCommand implements ICommand<ChangeIntereststDTO, string[] | string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeIntereststDTO): Promise<Result<string[] | string>> {
        try {
            const profile = await this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.interests = request.newInterests;

            await this.repository.save(profile);

            return Result.success<string[]>(profile.interests);
        
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }

}