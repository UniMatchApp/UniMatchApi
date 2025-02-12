import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IEventRepository } from "../ports/IEventRepository";
import { Survey } from "../../domain/Survey";
import { CreateSurveyDTO } from "../DTO/CreateSurveyDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class CreateSurveyCommand implements ICommand<CreateSurveyDTO, EventDTO> {
    private repository: IEventRepository;

    constructor(repository: IEventRepository) {
        this.repository = repository;
    }

    async run(request: CreateSurveyDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);
            if (!event) {
                throw new NotFoundError("Event not found");
            }

            if (event.ownerId !== request.userId) {
                throw new AuthorizationError(`User ${request.userId} is not the owner of the event`);
            }

            const survey = new Survey(request.survey.title, request.survey.options);

            event.addSurvey(survey);

            await this.repository.update(event, request.eventId);

            const mappedEvent = EventMapper.map(event);

            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
