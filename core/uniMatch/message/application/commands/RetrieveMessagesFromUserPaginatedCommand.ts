import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";

import {IMessageRepository} from "../ports/IMessageRepository";
import {
    RetrieveMessagesFromUserPaginatedDTO
} from "@/core/uniMatch/message/application/DTO/RetriveMessagesFromUserPaginatedDTO";
import {MessageDTO} from "@/core/uniMatch/message/application/DTO/MessageDTO";


export class RetrieveMessagesFromUserPaginatedCommand implements ICommand<RetrieveMessagesFromUserPaginatedDTO, MessageDTO[]> {
    private readonly repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    async run(request: RetrieveMessagesFromUserPaginatedDTO): Promise<Result<MessageDTO[]>> {
        try {
            const userId = request.userId;
            const after = request.after;  // Timestamp para paginación
            const limit = request.limit ?? 50;  // Límite de mensajes por página (por defecto 50)
            console.log(`Retrieving messages from user ${userId} paginated after ${after} with limit ${limit}`);
            const messages = await this.repository.findMessagesOfUserPaginated(userId, after, limit);
            console.log(`Retrieved ${messages.length} messages`);
            console.log(MessageDTO.fromDomainArray(messages));
            return Result.success<MessageDTO[]>(MessageDTO.fromDomainArray(messages));
        } catch (error: any) {
            console.error(error);
            return Result.failure<MessageDTO[]>(error);
        }
    }
}
