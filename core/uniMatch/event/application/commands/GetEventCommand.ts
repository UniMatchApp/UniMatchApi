import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { UUID } from "../../../../shared/domain/UUID";
import { GetEventDTO } from "../DTO/GetEventDTO";

export class GetEventCommand implements ICommand<GetEventDTO, Event> {
    private readonly repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    run(request: GetEventDTO): Result<Event> {
        try {

            const event = this.repository.findById(UUID.fromString(request.eventId));

            if (!event) {
                return Result.failure<Event>("Event not found");
            }

            return Result.success<Event>(event);
        } catch (error) {
            return Result.failure<Event>(error);
        }
    }
}