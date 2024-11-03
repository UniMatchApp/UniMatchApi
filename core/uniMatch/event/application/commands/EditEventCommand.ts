import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { EditEventDTO } from "../DTO/EditEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { Location } from "@/core/shared/domain/Location";
import { Event } from "../../domain/Event";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { FileError } from "@/core/shared/exceptions/FileError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";

export class EditEventCommand implements ICommand<EditEventDTO, Event> {
    private repository: IEventRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;


    constructor(repository: IEventRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: EditEventDTO): Promise<Result<Event>> {
        try {
            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<Event>(new NotFoundError("Event"));
            }

            if (event.ownerId !== request.ownerId) {
                return Result.failure<Event>(new AuthorizationError("You are not authorized to edit this event"));
            }

            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )

            const thumbnail = request.thumbnail;
            if(thumbnail && !thumbnail.name) {
                return Result.failure<Event>(new FileError("Thumbnail"));
            }

            let thumbnailPath: string | undefined = undefined;
            if(thumbnail) {
                thumbnailPath = await this.fileHandler.save(thumbnail.name, thumbnail);
            }
            
            event.edit(request.title, location, request.date,request.price, thumbnailPath);

            await this.repository.update(event, request.eventId);
            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}