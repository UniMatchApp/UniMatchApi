import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeLifeStyleDTO } from "../DTO/ChangeLifestyleDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { habitsFromString } from "../../domain/enum/HabitsEnum";

export class ChangeSportsCommand implements ICommand<ChangeLifeStyleDTO, string | undefined> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeLifeStyleDTO): Promise<Result<string | undefined>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if(!profile) {
                return Result.failure<string | undefined>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            profile.doesSports = habitsFromString(request.newContent);

            await this.repository.update(profile, profile.getId());
            return Result.success<string | undefined>(request.newContent);
        } catch (error: any) {
            return Result.failure<string | undefined>(error);
        }
    }
}