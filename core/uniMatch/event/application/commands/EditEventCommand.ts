import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { EditEventDTO } from "../DTO/EditEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { UUID } from "../../../../shared/domain/UUID";
import { Location } from "../../../../shared/domain/Location";

export class EditEventCommand implements ICommand<EditEventDTO, void> {
    private repository: IEventRepository;
    private eventBus: IEventBus;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    run(request: EditEventDTO): Result<void> {
        try {
            const eventId = UUID.fromString(request.eventId)
            const event = this.repository.findById(eventId);

            if (!event) {
                return Result.failure<void>("Event not found");
            }
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )

            event.edit(request.title, location, request.date,request.price, request.thumbnail);

            this.repository.update(event, eventId);
            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}