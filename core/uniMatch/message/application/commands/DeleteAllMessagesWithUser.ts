import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { DeleteAllUserMessagesDTO } from "../DTO/DeleteAllMessagesWithUserDTO";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

export class DeleteAllMessagesWithUserCommand implements ICommand<DeleteAllUserMessagesDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: DeleteAllUserMessagesDTO): Promise<Result<void>> {
        try {
            const userId = request.user;
            const otherUserId = request.targetUser;

            const userMessages = await this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!userMessages || userMessages.length === 0) {
                return Result.failure<void>("No messages found for this user.");
            }

            for (const message of userMessages) {
                if (message.attachment) {
                    this.fileHandler.delete(message.attachment);
                }
                message.delete();
                await this.repository.deleteById(message.getId());
                this.eventBus.publish(message.pullDomainEvents());
            }

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
