import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { UpdateMessageDTO } from "../DTO/UpdateMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

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
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }

}