import { ICommand } from "@/core/shared/application/ICommand";
import { IProfileRepository } from "../ports/IProfileRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Result } from "@/core/shared/domain/Result";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ChangeLocationDTO } from "../DTO/ChangeLocationDTO";
import { Location } from "@/core/shared/domain/Location";

export class ChangeLocationCommand implements ICommand<ChangeLocationDTO, {latitude?: number, longitude?: number, altitude?: number}> {

    private readonly repository: IProfileRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IProfileRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: ChangeLocationDTO): Promise<Result<{latitude?: number, longitude?: number, altitude?: number}>> {
        try {
            const profile = await this.repository.findByUserId(request.id)
            if (!profile) {
                return Result.failure<{latitude?: number, longitude?: number, altitude?: number}>(new NotFoundError(`Profile with id ${request.id} not found`));
            }

            if (request.latitude === undefined || request.longitude === undefined) {
                profile.location = undefined;
                profile.maxDistance = 0;
                await this.repository.update(profile, profile.getId());
                this.eventBus.publish(profile.pullDomainEvents());
                return Result.success<{latitude?: number, longitude?: number, altitude?: number}>({latitude: undefined, longitude: undefined, altitude: undefined});
            }

            profile.location = new Location(request.latitude, request.longitude, request.altitude);

            await this.repository.update(profile, profile.getId());

            this.eventBus.publish(profile.pullDomainEvents());
            return Result.success<{latitude?: number, longitude?: number, altitude?: number}>({latitude: request.latitude, longitude: request.longitude, altitude: request.altitude});
        } catch (error : any) {
            return Result.failure<{latitude?: number, longitude?: number, altitude?: number}>(error);
        }
    }
}