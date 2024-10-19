import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ChangeJobDTO } from "../DTO/ChangeJobDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";

export class ChangeJobCommand implements ICommand<ChangeJobDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    run(request: ChangeJobDTO): Result<string> {
        try {
            const profile = this.repository.findById(request.userId);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.job = request.job;
            this.repository.save(profile);
            return Result.success<string>(request.job);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}