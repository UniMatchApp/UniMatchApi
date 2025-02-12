import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Task } from "../../domain/Task";
import { CreateTaskDTO } from "../DTO/CreateTaskDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class CreateTaskCommand implements ICommand<CreateTaskDTO, EventDTO> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: CreateTaskDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);
            if (!event) {
                throw new NotFoundError("Event not found");
            }

            if (event.ownerId !== request.userId) {
                throw new AuthorizationError(`User ${request.userId} is not the owner of the event`);
            }

            const task = new Task(request.task.title, request.task.options);

            event.addTask(task);

            await this.repository.update(event, request.eventId);

            const mappedEvent = EventMapper.map(event);

            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
