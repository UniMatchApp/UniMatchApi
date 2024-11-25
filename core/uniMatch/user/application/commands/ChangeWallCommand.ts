import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import { ChangeWallDTO } from "../DTO/ChangeWallDTO";

export class ChangeWallCommand implements ICommand<ChangeWallDTO, string[]> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: ChangeWallDTO): Promise<Result<string[]>> {
        try {
            console.log(request)
            const profile = await this.repository.findByUserId(request.id)

            
            if (!profile) {
                return Result.failure<string[]>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            profile.wall = request.newContent;

            profile.preferredImage = request.newContent[0];

            await this.repository.update(profile, profile.getId());

            return Result.success<string[]>(request.newContent);

        } catch (error: any) {
            console.log(error)
            return Result.failure<string[]>(error);
        }
    }

}