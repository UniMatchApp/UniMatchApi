import { ICommand } from "@/core/shared/application/ICommand";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Result } from "@/core/shared/domain/Result";
import { ChangeDegreeDTO } from "../DTO/ChangeDegreeDTO";

export class ChangeDegreeCommand implements ICommand<ChangeDegreeDTO, string> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeDegreeDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id);
            if(!profile) {
                throw new Error('Profile not found');
            }
            profile.education = request.degree;
            await this.repository.save(profile);
            return Result.success<string>(request.degree);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}