import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { ParticipateEventDTO } from "../DTO/ParticipateEventDTO";

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
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}