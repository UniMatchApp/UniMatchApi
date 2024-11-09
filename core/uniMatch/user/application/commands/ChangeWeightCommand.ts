import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {ChangeWeightDTO} from "../DTO/ChangeWeightDTO";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";

export class ChangeWeightCommand implements ICommand<ChangeWeightDTO, string> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeWeightDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findById(request.id)
            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.weight = request.newWeight;

            await this.repository.update(profile, profile.getId());

            if (request.newWeight === undefined) {
                return Result.success<string>("");
            }
            return Result.success<string>(request.newWeight.toString());

        } catch (error: any) {
            return Result.failure<string>(error);
        }
    }

}