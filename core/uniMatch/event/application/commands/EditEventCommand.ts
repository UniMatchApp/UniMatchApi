import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { EditEventDTO } from "../DTO/EditEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { Location } from "@/core/shared/domain/Location";

export class EditEventCommand implements ICommand<EditEventDTO, void> {
    private repository: IEventRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;


    constructor(repository: IEventRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: EditEventDTO): Promise<Result<void>> {
        try {
            const event = await this.repository.findById(request.eventId);

            if (!event) {
                return Result.failure<void>("Event not found");
            }
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )
            const thumbnail = request.thumbnail;
            if (thumbnail && !this.fileHandler.isValid(thumbnail)) {
                return Result.failure<void>("Invalid thumbnail file");
            }

            const thumbnailName = thumbnail?.name;
            if(!thumbnailName) {
                return Result.failure<void>("Thumbnail name is invalid");
            }

            let thumbnailPath: string | undefined = undefined;
            if(thumbnail) {
                thumbnailPath = await this.fileHandler.save(thumbnailName, thumbnail);
            }
            
            event.edit(request.title, location, request.date,request.price, thumbnailPath);

            await this.repository.update(event, request.eventId);
            this.eventBus.publish(event.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}