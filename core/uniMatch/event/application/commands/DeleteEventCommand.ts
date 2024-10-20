import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeleteEventDTO } from "../DTO/DeleteEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class DeleteEventCommand implements ICommand<DeleteEventDTO, void> {
    private readonly repository: IEventRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;


    constructor(repository: IEventRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: DeleteEventDTO): Promise<Result<void>> {
         
       try {
            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<void>(new NotFoundError("Event not found"));
            }
            
            if (event?.thumbnail) {
                this.fileHandler.delete(event.thumbnail);
            }

            event.delete();

            await this.repository.deleteById(request.eventId);
            
            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<void>(undefined);
            
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}