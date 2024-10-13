import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Event } from "../../domain/Event";
import { CreateNewEventDTO } from "../DTO/CreateNewEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Location } from "@/core/shared/domain/Location";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

export class CreateNewEventCommand implements ICommand<CreateNewEventDTO, Event> {
    private repository: IEventRepository;
    private fileHandler: IFileHandler;
    private eventBus: IEventBus;


    constructor(repository: IEventRepository, fileHandler: IFileHandler, eventBus: IEventBus) {
        this.repository = repository;
        this.fileHandler = fileHandler;
        this.eventBus = eventBus;
    }

    run(request: CreateNewEventDTO): Result<Event> {
         
       try {
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )
          
            const thumbnail = request.thumbnail;
            if (thumbnail && !this.fileHandler.isValid(thumbnail)) {
                return Result.failure<Event>("Invalid thumbnail file");
            }

            const thumbnailName = thumbnail?.name;
            if(!thumbnailName) {
                return Result.failure<Event>("Thumbnail name is invalid");
            }

            let thumbnailPath: string | undefined = undefined;
            if(thumbnail) {
                thumbnailPath = this.fileHandler.save(thumbnailName, thumbnail);
            }

            const event = new Event(
                request.title,
                location,
                request.date,
                request.ownerId,
                [],
                [],
                request.price,
                thumbnailPath
            )

            this.repository.save(event);

            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<Event>(event);
        } catch (error : any) {
            return Result.failure<Event>(error);
        }
    }
}