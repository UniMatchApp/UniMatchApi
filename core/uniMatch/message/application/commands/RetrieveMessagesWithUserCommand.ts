import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {Message} from "../../domain/Message";

import {IMessageRepository} from "../ports/IMessageRepository";
import {RetrieveMessagesWithUserDTO} from "@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserDTO";

export class RetrieveMessagesWithUserCommand implements ICommand<RetrieveMessagesWithUserDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    run(request: RetrieveMessagesWithUserDTO): Result<Message[]> {
        try {
            const userId = request.user;
            const otherUserId = request.targetUser;

            const lastMessages = this.repository.findLastMessagesBetweenUsers(userId, otherUserId);

            if (!lastMessages || lastMessages.length === 0) {
                return Result.failure<Message[]>("No messages found between the users.");
            }

            return Result.success<Message[]>(lastMessages);
        } catch (error: any) {
            return Result.failure<Message[]>(error);
        }
    }
}
