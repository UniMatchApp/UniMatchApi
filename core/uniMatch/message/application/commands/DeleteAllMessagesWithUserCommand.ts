import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { DeleteAllUserMessagesDTO } from "../DTO/DeleteAllMessagesWithUserDTO";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class DeleteAllMessagesWithUserCommand implements ICommand<DeleteAllUserMessagesDTO, void> {
    private readonly repository: IMessageRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: DeleteAllUserMessagesDTO): Promise<Result<void>> {
        try {
            const userId = request.userId;
            const otherUserId = request.targetUserId;

            const userMessages = await this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!userMessages || userMessages.length === 0) {
                return Result.failure<void>(new NotFoundError('No messages found'));
            }

            for (const message of userMessages) {
                message.deleteForBoth();
                await this.repository.create(message);
                this.eventBus.publish(message.pullDomainEvents());
            }

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
