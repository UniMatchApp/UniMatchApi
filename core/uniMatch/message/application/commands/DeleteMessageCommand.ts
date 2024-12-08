import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {IMessageRepository} from "../ports/IMessageRepository";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {DeleteMessageDTO} from "../DTO/DeleteMessageDTO";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";

export class DeleteMessageCommand implements ICommand<DeleteMessageDTO, void> {
    private readonly repository: IMessageRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

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

            if (request.deleteForBoth && message.sender !== request.userId) {
                return Result.failure<void>(new ValidationError('User is not the sender and is not allowed to delete this message for both users'));
            }

            const userId = request.userId;

            switch (userId) {
                case message.sender:
                    (request.deleteForBoth) ? message.deleteForBoth(userId) : message.deleteForSender(userId);
                    break;
                case message.recipient:
                    message.deleteForRecipient(userId);
                    break;
                default:
                    return Result.failure<void>(new ValidationError('User is not allowed to delete this message'));
            }

            await this.repository.update(message, message.getId());
            this.eventBus.publish(message.pullDomainEvents());
            return Result.success<void>(undefined);

        } catch (error: any) {
            return Result.failure<void>(error);
        }
    }
}