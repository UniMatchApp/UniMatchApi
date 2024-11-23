import { ICommand } from "@/core/shared/application/ICommand";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Result } from "@/core/shared/domain/Result";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { Gender } from "@/core/shared/domain/Gender";
import { ChangeGenderPriorityDTO } from "../DTO/ChangeGenderPriorityDTO";

export class ChangeGenderPriorityCommand implements ICommand<ChangeGenderPriorityDTO, string | undefined> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeGenderPriorityDTO): Promise<Result<string | undefined>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<string | undefined>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            console.log('request.newGender', request.newGender);
            profile.genderPriority = request.newGender ? new Gender(Gender.fromString(request.newGender)) : undefined;

            await this.repository.update(profile, profile.getId());

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<string | undefined>(request.newGender);
        } catch (error : any) {

            return Result.failure<string | undefined>(error);
        }
    }
}