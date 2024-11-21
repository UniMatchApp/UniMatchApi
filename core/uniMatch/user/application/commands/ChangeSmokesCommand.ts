import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeLifeStyleDTO } from "../DTO/ChangeLifestyleDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { HabitsEnum, habitsFromString } from "../../domain/enum/HabitsEnum";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { NullPointerError } from "@/core/shared/exceptions/NullPointerError";

export class ChangeSmokesCommand implements ICommand<ChangeLifeStyleDTO, string> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeLifeStyleDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if(!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            console.log(request);
            
            profile.smokes = habitsFromString(request.newContent);

            await this.repository.update(profile, profile.getId());
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            console.log(error);
            return Result.failure<string>(error);
        }
    }
}