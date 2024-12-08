import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {UpdateMessageDTO} from "../DTO/UpdateMessageDTO";
import {IMessageRepository} from "../ports/IMessageRepository";
import {IEventBus} from "@/core/shared/application/IEventBus";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {ValidationError} from "@/core/shared/exceptions/ValidationError";
import {
    MessageDeletedStatusType,
    MessageReceptionStatusType,
    validateDeletedMessageStatusType,
    validateMessageStatusType
} from "@/core/shared/domain/MessageReceptionStatusEnum";
import {MessageDTO} from "@/core/uniMatch/message/application/DTO/MessageDTO";

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

            // Check if the userId is the sender of the message
            if (request.content && (messageToUpdate.sender !== request.userId)) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the sender of the message'));
            }

            if (request.status && !validateMessageStatusType(request.status)) {
                return Result.failure<MessageDTO>(new ValidationError('Invalid message status'));
            }

            if ((request.status as MessageReceptionStatusType === "RECEIVED" || request.status as MessageReceptionStatusType === "READ") &&
                (messageToUpdate.recipient !== request.userId)) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the recipient of the message. Cannot update status to RECEIVED or READ'));
            }

            if (request.deletedStatus && !validateDeletedMessageStatusType(request.deletedStatus)) {
                return Result.failure<MessageDTO>(new ValidationError('Invalid deleted status'));
            }

            if (request.deletedStatus as MessageDeletedStatusType === "NOT_DELETED") {
                return Result.failure<MessageDTO>(new ValidationError('Cannot update message to NOT_DELETED status'));
            }

            if ((request.deletedStatus as MessageDeletedStatusType === "DELETED_BY_SENDER" ||
                    request.deletedStatus as MessageDeletedStatusType === "DELETED_FOR_BOTH") &&
                request.userId !== messageToUpdate.sender) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the sender of the message. Cannot delete message'));
            }

            if ((request.deletedStatus as MessageDeletedStatusType === "DELETED_BY_RECIPIENT") &&
                (request.userId !== messageToUpdate.recipient)) {
                return Result.failure<MessageDTO>(new ValidationError('User is not the recipient of the message. Cannot delete message for recipient'));
            }

            if (request.deletedStatus && (request.status || request.content)) {
                return Result.failure<MessageDTO>(new ValidationError('Message status and content cannot be updated when deletedStatus is present'));
            }

            if (request.content && request.status) {
                return Result.failure<MessageDTO>(new ValidationError('Message status and content cannot be updated at the same time'));
            }


            messageToUpdate.edit(
                request.content,
                request.status as MessageReceptionStatusType,
                messageToUpdate.contentStatus,
                request.deletedStatus as MessageDeletedStatusType
            );

            await this.repository.update(messageToUpdate, request.messageId);
            this.eventBus.publish(messageToUpdate.pullDomainEvents());

            return Result.success<MessageDTO>(MessageDTO.fromDomain(messageToUpdate));
        } catch (error: any) {
            return Result.failure<MessageDTO>(error);
        }
    }

}