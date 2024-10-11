import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Event } from "../../domain/Event";
import { CreateNewEventDTO } from "../DTO/CreateNewEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { Location } from "../../../../shared/domain/Location";


export class CreateNewEventCommand implements ICommand<CreateNewEventDTO, Event> {
    private repository: IEventRepository;
    private eventBus: IEventBus;

    run(request: CreateNewEventDTO): Result<Event> {
         
       try {
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )

            //TODO: Add validation for location thumbnail and save
            

            const thumbnail = "thumbnail"; //TODO: Thumbnail URL

            const event = new Event(
                request.title,
                location,
                request.date,
                request.ownerId,
                [],
                [],
                request.price,
                thumbnail

            )

            this.repository.save(event);

            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<Event>(event);
        } catch (error) {
            return Result.failure<Event>(error);
        }
    }
}