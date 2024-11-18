import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMatchingRepository} from "../ports/IMatchingRepository";
import {Node} from "../../domain/Node";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {GetUsersWithMutualLikesDTO} from "../DTO/GetUsersWithMutualLikesDTO";
import {ProfileDTO} from "@/core/uniMatch/user/application/DTO/ProfileDTO";
import {IProfileRepository} from "@/core/uniMatch/user/application/ports/IProfileRepository";
import {Profile} from "@/core/uniMatch/user/domain/Profile";

export class GetUsersWithMutualLikesCommand implements ICommand<{ userId: string }, ProfileDTO[]> {
    private readonly matchingRepository: IMatchingRepository;
    private readonly profileRepository: IProfileRepository;


    constructor(repository: IMatchingRepository,
                profileRepository: IProfileRepository) {

        this.matchingRepository = repository;
        this.profileRepository = profileRepository;
    }

    async run(request: GetUsersWithMutualLikesDTO): Promise<Result<ProfileDTO[]>> {
        try {
            const user: Node | undefined = await this.matchingRepository.findByUserId(request.userId);
            console.log("USER", user);

            if (!user) {
                return Result.failure<ProfileDTO[]>(new NotFoundError("User not found"));
            }

            const mutualLikes = await this.matchingRepository.findMutualLikes(request.userId);
            const mutualLikesProfiles = [] as Profile[];
            for (const like of mutualLikes) {
                const profile = await this.profileRepository.findByUserId(like.userId);
                if (profile) {
                    mutualLikesProfiles.push(profile);
                }
            }
            return Result.success<ProfileDTO[]>(
                mutualLikesProfiles.map(profile => {
                        return ProfileDTO.fromProfile(profile)
                    }
                )
            );
        } catch (error: any) {
            return Result.failure<ProfileDTO[]>(error);
        }
    }
}
