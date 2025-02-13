import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { ParticipateEventDTO } from "../DTO/ParticipateEventDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class ParticipateEventCommand implements ICommand<ParticipateEventDTO, EventDTO> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: ParticipateEventDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<EventDTO>(new NotFoundError("Event not found"));
            }

            event.addParticipant(request.userId);
            await this.repository.update(event, request.eventId);

            const mappedEvent = EventMapper.map(event);
            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
