import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {Message} from "../../domain/Message";
import {IMessageRepository} from "../ports/IMessageRepository";
import {RetrieveMessagesWithUserDTO} from "@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserDTO";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";

export class RetrieveMessagesWithUserCommand implements ICommand<RetrieveMessagesWithUserDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    async run(request: RetrieveMessagesWithUserDTO): Promise<Result<Message[]>> {
        try {
            const userId = request.user;
            const otherUserId = request.targetUser;

            const lastMessages = await this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!lastMessages || lastMessages.length === 0) {
                return Result.failure<Message[]>(new NotFoundError('No messages found'));
            }

            return Result.success<Message[]>(lastMessages);
        } catch (error: any) {
            return Result.failure<Message[]>(error);
        }
    }
}
