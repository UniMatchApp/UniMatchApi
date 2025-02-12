import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class GetEventsCommand implements ICommand<undefined, EventDTO[]> {
    private readonly repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(): Promise<Result<EventDTO[]>> {
        try {
            const events = await this.repository.findAll();

            if (!events || events.length === 0) {
                return Result.failure<EventDTO[]>(new NotFoundError("Events not found"));
            }

            const mappedEvents = events.map(event => EventMapper.map(event));
            return Result.success<EventDTO[]>(mappedEvents);
        } catch (error: any) {
            return Result.failure<EventDTO[]>(error);
        }
    }
}
