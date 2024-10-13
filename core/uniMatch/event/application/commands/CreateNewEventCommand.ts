import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Event } from "../../domain/Event";
import { CreateNewEventDTO } from "../DTO/CreateNewEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { Location } from "../../../../shared/domain/Location";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

export class CreateNewEventCommand implements ICommand<CreateNewEventDTO, Event> {
    private repository: IEventRepository;
    private fileHandler: IFileHandler;
    private eventBus: IEventBus;

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
        } catch (error) {
            return Result.failure<Event>(error);
        }
    }
}