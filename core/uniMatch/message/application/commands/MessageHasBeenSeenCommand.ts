import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { MessageHasBeenSeenDTO } from "../DTO/MessageHasBeenSeenDTO";

export class MessageHasBeenSeenCommand implements ICommand<MessageHasBeenSeenDTO, void> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    run(request: MessageHasBeenSeenDTO): Result<void> {
        try {
            const message = this.repository.findById(request.messageId);
            const userId = request.userId;

            if (!message) {
                return Result.failure<void>("Message not found.");
            }

            if (message.recipient !== userId) {
                return Result.failure<void>("User is not the recipient of the message.");
            }

            if (message.status === 'READ') {
                return Result.failure<void>("Message has already been marked as read.");
            }

            message.status = 'READ';
            this.repository.save(message);
            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}
