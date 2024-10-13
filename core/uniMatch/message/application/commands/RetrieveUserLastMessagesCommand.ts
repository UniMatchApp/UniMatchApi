import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { RetrieveUserLastMessagesDTO } from "../DTO/RetrieveUserLastMessagesDTO";
import { IMessageRepository } from "../ports/IMessageRepository";

export class RetrieveUserLastMessagesCommand implements ICommand<RetrieveUserLastMessagesDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    run(request: RetrieveUserLastMessagesDTO): Result<Message[]> {
        try {
            const userId = request.user;

            const lastMessages = this.repository.findLastMessagesOfUser(userId);

            if (!lastMessages || lastMessages.length === 0) {
                return Result.failure<Message[]>("No messages found between the users.");
            }

            return Result.success<Message[]>(lastMessages);
        } catch (error) {
            return Result.failure<Message[]>(error);
        }
    }
}
