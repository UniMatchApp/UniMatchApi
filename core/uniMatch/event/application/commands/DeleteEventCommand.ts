import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { DeleteEventDTO } from "../DTO/DeleteEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

export class DeleteEventCommand implements ICommand<DeleteEventDTO, void> {
    private readonly repository: IEventRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    run(request: DeleteEventDTO): Result<void> {
         
       try {
            const event = this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<void>("Event not found");
            }
            
            if (event?.thumbnail) {
                this.fileHandler.delete(event.thumbnail);
            }

            event.delete();

            this.repository.deleteById(request.eventId);
            
            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<void>(undefined);
            
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}