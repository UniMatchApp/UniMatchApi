import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Event } from "../../domain/Event";

export class GetEventsCommand implements ICommand<undefined, Event[]> {
    private readonly repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(): Promise<Result<Event[]>> {
        try {
            const events = await this.repository.findAll();

            if (!events || events.length === 0) {
                return Result.failure<Event[]>("No events found");
            }

            return Result.success<Event[]>(events);
        } catch (error : any) {
            return Result.failure<Event[]>(error);
        }
    }
}
