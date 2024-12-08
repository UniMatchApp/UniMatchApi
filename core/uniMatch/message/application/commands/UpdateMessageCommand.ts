import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {UpdateMessageDTO} from "../DTO/UpdateMessageDTO";
import {IMessageRepository} from "../ports/IMessageRepository";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";
import {
    MessageReceptionStatusType,
    validateMessageReceptionStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import {MessageDTO} from "@/core/uniMatch/message/application/DTO/MessageDTO";
import { r } from "@faker-js/faker/dist/airline-BLb3y-7w";

export class UpdateMessageCommand implements ICommand<UpdateMessageDTO, MessageDTO> {
    private readonly repository: IMessageRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: UpdateMessageDTO): Promise<Result<MessageDTO>> {
        try {
            const messageToUpdate = await this.repository.findById(request.messageId);

            if (!messageToUpdate) {
                return Result.failure<MessageDTO>(new NotFoundError('Message not found'));
            }

            if (request.content && request.receptionStatus) {
                return Result.failure<MessageDTO>(new ValidationError('Message status and content cannot be updated at the same time'));
            }

            // Check if the userId is the sender of the message
            if (request.content && (messageToUpdate.sender !== request.userId)) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the sender of the message'));
            }

            if (request.receptionStatus && !validateMessageReceptionStatusType(request.receptionStatus)) {
                return Result.failure<MessageDTO>(new ValidationError('Invalid message reception status'));
            }

            if ((request.receptionStatus as MessageReceptionStatusType === "RECEIVED" ||
                    request.receptionStatus as MessageReceptionStatusType === "READ") &&
                (messageToUpdate.recipient !== request.userId)) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the recipient of the message. Cannot update status to RECEIVED or READ'));
            }

            messageToUpdate.edit(
                request.userId,
                request.content,
                request.receptionStatus as MessageReceptionStatusType,
            );

            await this.repository.update(messageToUpdate, request.messageId);
            this.eventBus.publish(messageToUpdate.pullDomainEvents());

            return Result.success<MessageDTO>(MessageDTO.fromDomain(request.userId, messageToUpdate));
        } catch (error: any) {
            return Result.failure<MessageDTO>(error);
        }
    }

}