import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";
import { ChangeIntereststDTO } from "../DTO/ChangeInterestsDTO";

export class UpdateWeightCommand implements ICommand<ChangeIntereststDTO, void> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    run(request: ChangeIntereststDTO): Result<void> {
        try {
            const profile = this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.interests = request.newInterests;

            this.repository.save(profile);

            return Result.success<void>(undefined);
        
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }

}