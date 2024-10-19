import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeAboutMeDTO } from "../DTO/ChangeAboutMeDTO";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";

export class ChangePersonalityCommand implements ICommand<ChangeAboutMeDTO, string> {
   
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    run(request: ChangeAboutMeDTO): Result<string> {
        try {
            const profile = this.repository.findById(request.userId);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.personalityType = request.newContent;
            this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }

}