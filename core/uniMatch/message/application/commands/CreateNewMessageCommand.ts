import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Message } from "../../domain/Message";
import { CreateNewMessageDTO } from "../DTO/CreateNewMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { FileError } from "@/core/shared/exceptions/FileError";
import {MessageDTO} from "@/core/uniMatch/message/application/DTO/MessageDTO";

export class CreateNewMessageCommand implements ICommand<CreateNewMessageDTO, MessageDTO> {
    private readonly repository: IMessageRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async run(request: CreateNewMessageDTO): Promise<Result<MessageDTO>> {    
        try {
            const file = request.attachment;

            const fileName = request.attachment?.name;
            if (file && !fileName) {
                return Result.failure<MessageDTO>(new FileError('File name is required'));
            }

            let attachmentUrl: string | undefined = undefined;

            if (file && fileName) {
                attachmentUrl = await this.fileHandler.save(fileName, file);
            }
            
            const message = new Message(
                request.content,
                request.senderId,
                request.recipientId,
                attachmentUrl
            )

            message.send(request.userId);

            await this.repository.create(message);
            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<MessageDTO>(MessageDTO.fromDomain(request.userId, message));
        } catch (error : any) {
            console.error(error);
            return Result.failure<MessageDTO>(error);
        }
    }
}
