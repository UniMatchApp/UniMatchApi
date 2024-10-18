import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeSexualOrientationDTO } from "../DTO/ChangeSexualOrientationDTO";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Profile } from "../../domain/Profile";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { SexualOrientation } from "../../domain/SexualOrientation";

export class ChangeSexualOrientationCommand implements ICommand<ChangeSexualOrientationDTO, string> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    run(request: ChangeSexualOrientationDTO): Result<string> {
        try {
            const profile = this.repository.findById(request.id)
            if (!profile) {
                throw new Error(`Profile with id ${request.id} not found`);
            }
            
            profile.sexualOrientation.setValue(request.newSexualOrientation);

            this.repository.save(profile);

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<string>(request.newSexualOrientation);
        } catch (error : any) {
            return Result.failure<string>(error);
        }
    }
}