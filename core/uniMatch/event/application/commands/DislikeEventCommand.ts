import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { LikeEventDTO } from "../DTO/LikeEventDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class DislikeEventCommand implements ICommand<LikeEventDTO, Event> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: LikeEventDTO): Promise<Result<Event>> {
        try {
            const event = await this.repository.findById(request.eventId);
            
            if (!event) {
                return Result.failure<Event>(new NotFoundError("Event not found"));
            }

            event.dislike(request.userId);
            await this.repository.update(event, event.getId());
            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}