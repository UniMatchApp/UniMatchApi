import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { UUID } from "../../../../shared/domain/UUID";
import { LikeEventDTO } from "../DTO/LikeEventDTO";

export class DislikeEventCommand implements ICommand<LikeEventDTO, Event> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    run(request: LikeEventDTO): Result<Event> {
        try {
            const event = this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<Event>("Event not found");
            }

            event.dislike(request.userId);
            this.repository.save(event);
            return Result.success<Event>(event);
        } catch (error) {
            return Result.failure<Event>(error);
        }
    }
}