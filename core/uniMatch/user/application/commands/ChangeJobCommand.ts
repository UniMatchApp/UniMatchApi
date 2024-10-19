import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeMoreAboutMeDTO } from "../DTO/ChangeMoreAboutMeDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";

export class ChangeJobCommand implements ICommand<ChangeMoreAboutMeDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    run(request: ChangeMoreAboutMeDTO): Result<string> {
        try {
            const profile = this.repository.findById(request.userId);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.job = request.newContent;
            this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}