import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UpdateAboutMeDTO } from "../DTO/UpdateAboutMeDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { Profile } from "../../domain/Profile";

export class UpdateAboutMeCommand implements ICommand<UpdateAboutMeDTO, void> {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository) {
        this.repository = repository;
    }
    
    run(request: UpdateAboutMeDTO): Result<void> {
        try {
            const profile = this.repository.findById(request.userId)
            if (!profile) {
                throw new Error(`Profile with id ${request.userId} not found`);
            }

            profile.aboutMe = request.newContent;

            this.repository.save(profile);

            return Result.success<void>(undefined);
        
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }

}