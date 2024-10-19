import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeHeightDTO } from "../DTO/ChangeHeightDTO";

export class ChangeHeightCommand implements ICommand<ChangeHeightDTO, string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeHeightDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.height = request.newHeight;

            await this.repository.save(profile);

            return Result.success<string>(request.newHeight.toString());
        
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }

}