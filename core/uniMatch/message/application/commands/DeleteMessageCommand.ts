import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { IMessageRepository } from "../ports/IMessageRepository";
import { IEventBus } from "../../../../shared/application/IEventBus";
import { UUID } from "../../../../shared/domain/UUID";
import { DeleteMessageDTO } from "../DTO/DeleteMessageDTO";

export class DeleteMessageCommand implements ICommand<DeleteMessageDTO, void> {
    private repository: IMessageRepository;
    private eventBus: IEventBus;

    run(request: DeleteMessageDTO): Result<void> {
         
        try {
            const messageId = UUID.fromString(request.messageId);
            const message = this.repository.findById(messageId);

            if (!message) {
                return Result.failure<void>("Message not found");
            }

            message.delete();

            this.repository.deleteById(messageId);


            this.eventBus.publish(message.pullDomainEvents());

            return Result.success<void>(undefined);

        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}