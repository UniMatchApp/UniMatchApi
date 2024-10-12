import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { UpdateMessageDTO } from "../DTO/UpdateMessageDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { UUID } from "../../../../shared/domain/UUID";

export class UpdateMessageCommand implements ICommand<UpdateMessageDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;

    run(request: UpdateMessageDTO): Result<void> {
         
        try {
            const messageId = UUID.fromString(request.messageId);
            const messageToUpdate = this.repository.findById(messageId);

            if (!messageToUpdate) {
                return Result.failure<void>("Message not found");
            }

            messageToUpdate.edit(
                request.content,
                request.attachment
            );

            this.repository.update(messageToUpdate, messageId);
            this.eventBus.publish(messageToUpdate.pullDomainEvents());

            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }

}