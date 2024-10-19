import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";
import { GetEventDTO } from "../DTO/GetEventDTO";

export class GetEventCommand implements ICommand<GetEventDTO, Event> {
    private readonly repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: GetEventDTO): Promise<Result<Event>> {
        try {

            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<Event>("Event not found");
            }

            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}