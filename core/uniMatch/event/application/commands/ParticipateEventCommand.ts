import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { ParticipateEventDTO } from "../DTO/ParticipateEventDTO";
import { UUID } from "../../../../shared/domain/UUID";

export class ParticipateEventCommand implements ICommand<ParticipateEventDTO, Event> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    run(request: ParticipateEventDTO): Result<Event> {
        try {
            const event = this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<Event>("Event not found");
            }

            event.addParticipant(request.userId);
            this.repository.save(event);

            return Result.success<Event>(event);
        } catch (error) {
            return Result.failure<Event>(error);
        }
    }
}