import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { GetProfileDTO } from "../DTO/GetProfileDTO";
import { Profile } from "../../domain/Profile";

export class GetProfileCommand implements ICommand<GetProfileDTO, Profile> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: GetProfileDTO): Promise<Result<Profile>> {
        try {
            const profile = await this.repository.findById(request.id);
            if (!profile) {
                return Result.failure<Profile>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            return Result.success<Profile>(profile);
        } catch (error: any) {
            return Result.failure<Profile>(error);
        }
    }
}
