import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { UpdateMessageDTO } from "../DTO/UpdateMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { UUID } from "../../../../shared/domain/UUID";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

export class UpdateMessageCommand implements ICommand<UpdateMessageDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }
    
    run(request: UpdateMessageDTO): Result<void> {
         
        try {
            const messageToUpdate = this.repository.findById(request.messageId);
            let attachmentUrl: string | undefined = undefined;

            if (!messageToUpdate) {
                return Result.failure<void>("Message not found");
            }

            if (request.attachment) {
                if (!this.fileHandler.isValid(request.attachment)) {
                    return Result.failure<void>("Invalid file.");
                }

                const fileName = request.attachment.name;
                if (!fileName) {
                    return Result.failure<void>("Invalid file name.");
                }

                if (messageToUpdate.attachment) {
                    this.fileHandler.delete(messageToUpdate.attachment);
                }

                attachmentUrl = this.fileHandler.save(fileName, request.attachment);
            }

            messageToUpdate.edit(
                request.content,
                attachmentUrl
            );

            this.repository.update(messageToUpdate, request.messageId);
            this.eventBus.publish(messageToUpdate.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }

}