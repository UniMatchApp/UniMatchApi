import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { GetEventDTO } from "../DTO/GetEventDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class GetEventCommand implements ICommand<GetEventDTO, EventDTO> {
    private readonly repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: GetEventDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<EventDTO>(new NotFoundError("Event not found"));
            }

            const mappedEvent = EventMapper.map(event);
            console.log("Mapped event: ", mappedEvent);
            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
