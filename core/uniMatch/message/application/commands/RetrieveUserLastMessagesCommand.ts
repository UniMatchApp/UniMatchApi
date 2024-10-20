import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Message } from "../../domain/Message";
import { RetrieveUserLastMessagesDTO } from "../DTO/RetrieveUserLastMessagesDTO";
import { IMessageRepository } from "../ports/IMessageRepository";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class RetrieveUserLastMessagesCommand implements ICommand<RetrieveUserLastMessagesDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    async run(request: RetrieveUserLastMessagesDTO): Promise<Result<Message[]>> {
        try {
            const userId = request.userId;

            const lastMessages = await this.repository.findLastMessagesOfUser(userId);

            if (!lastMessages || lastMessages.length === 0) {
                return Result.failure<Message[]>(new NotFoundError('No messages found'));
            }
            return Result.success<Message[]>(lastMessages);
        } catch (error : any) {
            return Result.failure<Message[]>(error);
        }
    }
}
