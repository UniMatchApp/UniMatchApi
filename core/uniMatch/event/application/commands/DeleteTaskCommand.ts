import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { DeleteTaskDTO } from "../DTO/DeleteTaskDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";

export class DeleteTaskCommand implements ICommand<DeleteTaskDTO, void> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: DeleteTaskDTO): Promise<Result<void>> {
        try {
            const event = await this.repository.findById(request.eventId);
            if (!event) {
                throw new NotFoundError("Event not found");
            }

            if (event.ownerId !== request.userId) {
                throw new AuthorizationError(`User ${request.userId} is not the owner of the event`);
            }

            event.removeTaskByTitle(request.title);

            await this.repository.update(event, request.eventId);

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
