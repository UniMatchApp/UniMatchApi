import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { ParticipateEventDTO } from "../DTO/ParticipateEventDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class ParticipateEventCommand implements ICommand<ParticipateEventDTO, Event> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: ParticipateEventDTO): Promise<Result<Event>> {
        try {
            const event = await this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<Event>(new NotFoundError("Event"));
            }

            event.addParticipant(request.userId);
            await this.repository.update(event, request.eventId);

            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}