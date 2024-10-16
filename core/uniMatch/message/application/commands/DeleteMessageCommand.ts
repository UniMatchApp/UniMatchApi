import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { DeleteMessageDTO } from "../DTO/DeleteMessageDTO";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

export class DeleteMessageCommand implements ICommand<DeleteMessageDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }
    run(request: DeleteMessageDTO): Result<void> {
         
        try {
            const message = this.repository.findById(request.messageId);

            if (!message) {
                return Result.failure<void>("Message not found");
            }

            if (message.attachment) {
                this.fileHandler.delete(message.attachment);
            }

            message.delete();

            this.repository.deleteById(request.messageId);

            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<void>(undefined);

        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}