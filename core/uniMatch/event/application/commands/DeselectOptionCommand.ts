import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { SelectOptionDTO } from "../DTO/SelectOptionDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";

export class DeselectOptionCommand implements ICommand<SelectOptionDTO, void> {
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

            const survey = event.surveys.find(t => t.title === request.title);
            if (!survey) {
                throw new NotFoundError("Survey not found");
            }

            survey.deselectOption(request.option, request.userId);

            await this.repository.update(event, request.eventId);

            return Result.success<void>(undefined);
        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}
