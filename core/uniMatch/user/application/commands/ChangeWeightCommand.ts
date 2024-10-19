import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeWeightDTO } from "../DTO/ChangeWeightDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";

export class UpdateWeightCommand implements ICommand<ChangeWeightDTO, void> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    run(request: ChangeWeightDTO): Result<void> {
        try {
            const profile = this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.weight = request.newWeight;

            this.repository.save(profile);

            return Result.success<void>(undefined);
        
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }

}