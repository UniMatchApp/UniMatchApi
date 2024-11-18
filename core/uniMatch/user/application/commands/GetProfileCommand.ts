import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {GetProfileDTO} from "../DTO/GetProfileDTO";
import {ProfileDTO} from "@/core/uniMatch/user/application/DTO/ProfileDTO";

export class GetProfileCommand implements ICommand<GetProfileDTO, ProfileDTO> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: GetProfileDTO): Promise<Result<ProfileDTO>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            if (!profile) {
                return Result.failure<ProfileDTO>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            return Result.success<ProfileDTO>(
                ProfileDTO.fromProfile(profile)
            );
        } catch (error: any) {
            return Result.failure<ProfileDTO>(error);
        }
    }
}
