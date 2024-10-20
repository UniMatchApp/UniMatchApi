import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMessageRepository} from "../ports/IMessageRepository";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {DeleteMessageDTO} from "../DTO/DeleteMessageDTO";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";

export class DeleteMessageCommand implements ICommand<DeleteMessageDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: DeleteMessageDTO): Promise<Result<void>> {
        try {

            const message = await this.repository.findById(request.messageId);

            if (!message) {
                return Result.failure<void>(new NotFoundError('Message not found'));
            }

            if (message.attachment && (message.sender === request.userId)) {
                this.fileHandler.delete(message.attachment);
            }

            if (message.sender === request.userId) {
                message.deleteForBoth();
            } else if (message.recipient === request.userId) {
                message.deleteByRecipient();
            } else {
                return Result.failure<void>(new ValidationError('User is not allowed to delete this message'));
            }

            await this.repository.create(message);

            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<void>(undefined);

        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}