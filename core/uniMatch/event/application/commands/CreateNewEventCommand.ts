import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Event } from "../../domain/Event";
import { CreateNewEventDTO } from "../DTO/CreateNewEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Location } from "@/core/shared/domain/Location";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { FileError } from "@/core/shared/exceptions/FileError";

export class CreateNewEventCommand implements ICommand<CreateNewEventDTO, Event> {
    private repository: IEventRepository;
    private fileHandler: IFileHandler;
    private eventBus: IEventBus;


    constructor(repository: IEventRepository, fileHandler: IFileHandler, eventBus: IEventBus) {
        this.repository = repository;
        this.fileHandler = fileHandler;
        this.eventBus = eventBus;
    }

    async run(request: CreateNewEventDTO): Promise<Result<Event>> {
         
       try {
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )
          
            const attachment = request.attachment;
            if (attachment && !attachment.name) {
                return Result.failure<Event>(new FileError("attachment name is invalid"));
            }

            let attachmentPath: string | undefined = undefined;
            if(attachment) {
                attachmentPath = await this.fileHandler.save(attachment.name, attachment);
            }

            const event = new Event(
                request.title,
                location,
                request.date,
                request.ownerId,
                [],
                [],
                request.price,
                attachmentPath
            )

            
            await this.repository.create(event);

            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}