import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Message } from "../../domain/Message";
import { CreateNewMessageDTO } from "../DTO/CreateNewMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";

export class CreateNewMessageCommand implements ICommand<CreateNewMessageDTO, Message> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    constructor(repository: IMessageRepository, eventBus: IEventBus, fileHandler: IFileHandler) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    run(request: CreateNewMessageDTO): Result<Message> {
        
        const file = request.attachment;

        if (file && !this.fileHandler.isValid(file)) {
            return Result.failure<Message>("Invalid file.");
        }

        const fileName = request.attachment?.name;
        if (!fileName) {
            return Result.failure<Message>("Invalid file name.");
        }

        let attachmentUrl: string | undefined = undefined;

        if (file) {
            attachmentUrl = this.fileHandler.save(fileName, file);
        }

        try {
            const message = new Message(
                request.content,
                request.sender,
                request.recipient,
                attachmentUrl
            )

            this.repository.save(message);
            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<Message>(message);
        } catch (error : any) {
            return Result.failure<Message>(error);
        }
    }
}
