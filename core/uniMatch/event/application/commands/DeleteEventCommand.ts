import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { DeleteEventDTO } from "../DTO/DeleteEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { EventIsDeleted } from "../../domain/events/EventIsDeletedEvent";
import { UUID } from "../../../../shared/domain/UUID";


export class DeleteEventCommand implements ICommand<DeleteEventDTO, void> {
    private readonly repository: IEventRepository;
    private readonly eventBus: IEventBus;

    run(request: DeleteEventDTO): Result<void> {
         
       try {
        
            // busco evento en repositorio
            const eventId = UUID.fromString(request.eventId); // Transformar el string a UUID
            const event = this.repository.findById(eventId);

            if (!event) {
                return Result.failure<void>("Event not found");
            }

            this.repository.deleteById(eventId);

            // Publicar el evento de dominio EventIsDeleted
            const eventDeleted = EventIsDeleted.from(event);
            
            this.eventBus.publish([eventDeleted]);

            return Result.success<void>(undefined);  // TODO
            
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}