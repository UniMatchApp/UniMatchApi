import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { Message } from "../../domain/Message";
import { RetriveMessagesWithUserDTO } from "../DTO/RetriveMessagesWithUserDTO";
import { IMessageRepository } from "../ports/IMessageRepository";

export class RetriveMessagesWithUserCommand implements ICommand<RetriveMessagesWithUserDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    run(request: RetriveMessagesWithUserDTO): Result<Message[]> {
        try {
            const userId = request.user;
            const otherUserId = request.targetUser;

            const lastMessages = this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!lastMessages || lastMessages.length === 0) {
                return Result.failure<Message[]>("No messages found between the users.");
            }

            return Result.success<Message[]>(lastMessages);
        } catch (error) {
            return Result.failure<Message[]>(error);
        }
    }
}
