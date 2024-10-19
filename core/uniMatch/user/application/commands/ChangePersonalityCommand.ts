import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeAboutMeDTO } from "../DTO/ChangeAboutMeDTO";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";

export class ChangePersonalityCommand implements ICommand<ChangeAboutMeDTO, string> {
   
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeAboutMeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.personalityType = request.newContent;
            await this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }

}