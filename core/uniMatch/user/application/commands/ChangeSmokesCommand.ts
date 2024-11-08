import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeLifeStyleDTO } from "../DTO/ChangeLifestyleDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { HabitsEnum } from "../../domain/enum/HabitsEnum";
import { DomainError } from "@/core/shared/exceptions/DomainError";

export class ChangeSmokesCommand implements ICommand<ChangeLifeStyleDTO, string> {

    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeLifeStyleDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id);
            if(!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            if(request.newContent) {
                const smokes = HabitsEnum[request.newContent.toUpperCase() as keyof typeof HabitsEnum];
            
                if(smokes === undefined) {
                    return Result.failure<string>(new DomainError(`Invalid smokes value.`));
                }
                profile.smokes = smokes;
            }
            

            

            await this.repository.update(profile, profile.getId());
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}