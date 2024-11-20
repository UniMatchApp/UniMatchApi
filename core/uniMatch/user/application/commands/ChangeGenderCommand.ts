import { ICommand } from "@/core/shared/application/ICommand";
import { ChangeGenderDTO } from "../DTO/ChangeGenderDTO";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Result } from "@/core/shared/domain/Result";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { Gender } from "@/core/shared/domain/Gender";

export class ChangeGenderCommand implements ICommand<ChangeGenderDTO, string> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeGenderDTO): Promise<Result<string>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<string>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            profile.gender.setValue(Gender.fromString(request.newGender));

            await this.repository.update(profile, profile.getId());

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<string>(request.newGender);
        } catch (error : any) {
            console.log(error);
            return Result.failure<string>(error);
        }
    }
}