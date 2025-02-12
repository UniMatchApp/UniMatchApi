import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { LikeEventDTO } from "../DTO/LikeEventDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class LikeEventCommand implements ICommand<LikeEventDTO, EventDTO> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: LikeEventDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<EventDTO>(new NotFoundError("Event not found"));
            }

            event.like(request.userId);
            await this.repository.update(event, request.eventId);

            const mappedEvent = EventMapper.map(event);
            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
