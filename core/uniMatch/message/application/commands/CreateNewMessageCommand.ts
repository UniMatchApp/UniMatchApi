import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { CreateNewMessageDTO } from "../DTO/CreateNewMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { IFileHandler } from "../../../../shared/application/IFileHandler";

export class CreateNewMessageCommand implements ICommand<CreateNewMessageDTO, Message> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;
    private fileHandler: IFileHandler;

    run(request: CreateNewMessageDTO): Result<Message> {
        
        

        const attachmentUrl = "";
        try {
            const message = new Message(
                request.content,
                request.status,
                request.timestamp,
                request.sender,
                request.recipient,
                attachmentUrl
            )

            this.repository.save(message);
            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<Message>(message);
        } catch (error) {
            return Result.failure<Message>(error);
        }
    }
}
