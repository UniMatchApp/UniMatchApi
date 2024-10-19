import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeLifeStyleDTO } from "../DTO/ChangeLifeStyleDTO";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";

export class ChangePetsCommand implements ICommand<ChangeLifeStyleDTO, string> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    run(request: ChangeLifeStyleDTO): Result<string> {
        try {
            const profile = this.repository.findById(request.userId);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.pets = request.newContent;
            this.repository.save(profile);
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}