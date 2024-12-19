import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { IMessageRepository } from "../ports/IMessageRepository";
import { MessageHasBeenSeenDTO } from "../DTO/MessageHasBeenSeenDTO";
import { MessageContentStatusEnum, MessageDeletedStatusEnum, MessageReceptionStatusEnum } from "@/core/shared/domain/MessageReceptionStatusEnum";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { MessageHasBeenReceivedDTO } from "../DTO/MessageHasBeenReceivedDTO";

export class MessageHasBeenReceivedCommand implements ICommand<MessageHasBeenReceivedDTO, void> {
    private readonly repository: IMessageRepository;
    private readonly eventBus: IEventBus;

    constructor(repository: IMessageRepository, eventBus: IEventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: MessageHasBeenReceivedDTO): Promise<Result<void>> {
        try {
            const message = await this.repository.findById(request.messageId);
            const userId = request.userId;

            if (!message) {
                return Result.failure<void>(new NotFoundError('Message not found'));
            }

            if (message.recipient !== userId) {
                return Result.failure<void>(new ValidationError('User is not the recipient of the message.'));
            }

            if (message.receptionStatus === MessageReceptionStatusEnum.RECEIVED) {
                return Result.failure<void>(new ValidationError('Message has already been received.'));
            }

            message.received(userId);

            await this.repository.update(message, message.getId());
            this.eventBus.publish(message.pullDomainEvents());
            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
