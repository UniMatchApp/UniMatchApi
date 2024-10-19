import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { MessageHasBeenSeenDTO } from "../DTO/MessageHasBeenSeenDTO";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";

export class MessageHasBeenSeenCommand implements ICommand<MessageHasBeenSeenDTO, void> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    async run(request: MessageHasBeenSeenDTO): Promise<Result<void>> {
        try {
            const message = await this.repository.findById(request.messageId);
            const userId = request.userId;

            if (!message) {
                return Result.failure<void>("Message not found.");
            }

            if (message.recipient !== userId) {
                return Result.failure<void>("User is not the recipient of the message.");
            }

            if (message.status === MessageStatusEnum.READ) {
                return Result.failure<void>("Message has already been marked as read.");
            }

            message.status = MessageStatusEnum.READ;
            await this.repository.save(message);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
