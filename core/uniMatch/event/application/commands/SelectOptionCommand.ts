import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { SelectOptionDTO } from "../DTO/SelectOptionDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";

export class SelectOptionCommand implements ICommand<SelectOptionDTO, void> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: SelectOptionDTO): Promise<Result<void>> {
        try {
            const event = await this.repository.findById(request.eventId);
            if (!event) {
                throw new NotFoundError("Event not found");
            }

            if (!event.participants.includes(request.userId)) {
                throw new AuthorizationError(`User ${request.userId} is not a participant of the event`);
            }

            const task = event.tasks.find(t => t.title === request.title);
            if (!task) {
                throw new NotFoundError("Task not found");
            }

            task.selectOption(request.option, request.userId);

            await this.repository.update(event, request.eventId);

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
