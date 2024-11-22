import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {ChangeWeightDTO} from "../DTO/ChangeWeightDTO";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";

export class ChangeWeightCommand implements ICommand<ChangeWeightDTO, number> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeWeightDTO): Promise<Result<number>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<number>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.weight = request.newWeight;

            await this.repository.update(profile, profile.getId());

            return Result.success<number>(request.newWeight!);

        } catch (error: any) {
            return Result.failure<number>(error);
        }
    }

}