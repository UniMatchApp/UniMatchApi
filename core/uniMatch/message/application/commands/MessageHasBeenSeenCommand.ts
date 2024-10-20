import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { MessageHasBeenSeenDTO } from "../DTO/MessageHasBeenSeenDTO";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";

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
                return Result.failure<void>(new NotFoundError('Message not found'));
            }

            if (message.recipient !== userId) {
                return Result.failure<void>(new ValidationError('User is not the recipient of the message.'));
            }

            if (message.status === MessageStatusEnum.READ) {
                return Result.failure<void>(new ValidationError('Message has already been read.'));
            }

            message.status = MessageStatusEnum.READ;
            await this.repository.save(message);
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
