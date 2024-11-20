import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeSexualOrientationDTO } from "../DTO/ChangeSexualOrientationDTO";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Result } from "@/core/shared/domain/Result";
import { IProfileRepository } from "../ports/IProfileRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { SexualOrientation } from "../../domain/SexualOrientation";

export class ChangeSexualOrientationCommand implements ICommand<ChangeSexualOrientationDTO, string> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeSexualOrientationDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            profile.sexualOrientation.setValue(SexualOrientation.fromString(request.newSexualOrientation));

            await this.repository.update(profile, profile.getId());

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<string>(request.newSexualOrientation);
        } catch (error : any) {
            console.log(error);
            return Result.failure<string>(error);
        }
    }
}