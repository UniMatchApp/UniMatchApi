import { ICommand } from "@/core/shared/application/ICommand";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Result } from "@/core/shared/domain/Result";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ChangeMaxDistanceDTO } from "../DTO/ChangeMaxDistanceDTO";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";

export class ChangeMaxDistanceCommand implements ICommand<ChangeMaxDistanceDTO, number> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeMaxDistanceDTO): Promise<Result<number>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<number>(new NotFoundError(`Profile with id ${request.id} not found`));
            }
            
            if (profile.location === undefined) {
                profile.maxDistance = 0;
                await this.repository.update(profile, profile.getId());
                return Result.success<number>(0);
            }

            profile.maxDistance = request.distance;

            await this.repository.update(profile, profile.getId());

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<number>(request.distance);
        } catch (error : any) {
            return Result.failure<number>(error);
        }
    }
}