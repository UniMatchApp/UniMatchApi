import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeAboutMeDTO } from "../DTO/ChangeAboutMeDTO";

export class ChangeAboutMeCommand implements ICommand<ChangeAboutMeDTO, string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    async run(request: ChangeAboutMeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id)
            if (!profile) {
                throw new Error(`Profile with id ${request.id} not found`);
            }

            profile.aboutMe = request.newContent;

            await this.repository.save(profile);

            return Result.success<string>(request.newContent);
        
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }

}