import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IProfileRepository} from "../ports/IProfileRepository";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {GetProfileDTO} from "../DTO/GetProfileDTO";
import {ProfileDTO} from "@/core/uniMatch/user/application/DTO/ProfileDTO";
import { ProfileInfoDTO } from "../DTO/ProfileInfoDTO";

export class GetProfileInfoCommand implements ICommand<GetProfileDTO, ProfileInfoDTO> {
    private readonly repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }

    async run(request: GetProfileDTO): Promise<Result<ProfileInfoDTO>> {
        try {
            const profile = await this.repository.findByUserId(request.id);
            console.log("Profile: ", profile);
            if (!profile) {
                return Result.failure<ProfileInfoDTO>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            return Result.success<ProfileInfoDTO>(
                ProfileInfoDTO.fromProfile(profile)
            );
        } catch (error: any) {
            return Result.failure<ProfileInfoDTO>(error);
        }
    }
}
