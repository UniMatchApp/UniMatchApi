import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { EditEventDTO } from "../DTO/EditEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { Location } from "@/core/shared/domain/Location";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { FileError } from "@/core/shared/exceptions/FileError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";

export class EditEventCommand implements ICommand<EditEventDTO, EventDTO> {
    private repository: IEventRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IEventRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: EditEventDTO): Promise<Result<EventDTO>> {
        try {
            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<EventDTO>(new NotFoundError("Event not found"));
            }

            if (event.ownerId !== request.ownerId) {
                return Result.failure<EventDTO>(new AuthorizationError("You are not authorized to edit this event"));
            }

            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            );

            const attachment = request.attachment;
            if (attachment && !attachment.name) {
                return Result.failure<EventDTO>(new FileError("Attachment is not a valid file"));
            }

            let attachmentPath: string | undefined = undefined;
            if (attachment) {
                attachmentPath = await this.fileHandler.save(attachment.name, attachment);
            }

            event.edit(request.title, location, request.date, request.price, attachmentPath);

            await this.repository.update(event, request.eventId);
            this.eventBus.publish(event.pullDomainEvents());

            const mappedEvent = EventMapper.map(event); // Convertimos el Event a EventDTO
            return Result.success<EventDTO>(mappedEvent);
        } catch (error: any) {
            return Result.failure<EventDTO>(error);
        }
    }
}
