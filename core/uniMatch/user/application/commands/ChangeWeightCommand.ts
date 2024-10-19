import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeWeightDTO } from "../DTO/ChangeWeightDTO";
import { IProfileRepository } from "../ports/IProfileRepository";

export class UpdateWeightCommand implements ICommand<ChangeWeightDTO, string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeWeightDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.weight = request.newWeight;

            await this.repository.save(profile);

            return Result.success<string>(request.newWeight.toString());
        
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }

}