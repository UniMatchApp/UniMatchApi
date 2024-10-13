import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { DeleteAllUserMessagesDTO } from "../DTO/DeleteAllMessagesWithUserDTO";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

export class DeleteAllMessagesWithUserCommand implements ICommand<DeleteAllUserMessagesDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    run(request: DeleteAllUserMessagesDTO): Result<void> {
        try {
            const userId = request.user;
            const otherUserId = request.targetUser;

            const userMessages = this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!userMessages || userMessages.length === 0) {
                return Result.failure<void>("No messages found for this user.");
            }

            for (const message of userMessages) {
                if (message.attachment) {
                    this.fileHandler.delete(message.attachment);
                }
                message.delete();
                this.repository.deleteById(message.getId());
                this.eventBus.publish(message.pullDomainEvents());
            }

            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}
