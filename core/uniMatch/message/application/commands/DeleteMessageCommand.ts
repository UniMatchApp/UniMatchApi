import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { DeleteMessageDTO } from "../DTO/DeleteMessageDTO";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

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

        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}