import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { ChangeLifeStyleDTO } from "../DTO/ChangeLifestyleDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ValuesAndBeliefsEnum, ValuesAndBeliefsFromString } from "../../domain/enum/ValuesAndBeliefsEnum";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { NullPointerError } from "@/core/shared/exceptions/NullPointerError";

export class ChangeValuesAndBeliefsCommand implements ICommand<ChangeLifeStyleDTO, string> {

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

            if(!request.newContent) {
                return Result.failure<string>(new NullPointerError(`Invalid values and beliefs value.`));
            }

            const valuesAndBeliefs = ValuesAndBeliefsFromString(request.newContent);
            
                if(valuesAndBeliefs === undefined) {
                    return Result.failure<string>(new DomainError(`Invalid values and beliefs value.`));
                }
    
                profile.valuesAndBeliefs = valuesAndBeliefs;
            

            await this.repository.update(profile, profile.getId());
            return Result.success<string>(request.newContent);
        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }
}