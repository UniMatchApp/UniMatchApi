import {ICommand} from "@/core/shared/application/ICommand";
import {Result} from "@/core/shared/domain/Result";
import {Message} from "../../domain/Message";
import {IMessageRepository} from "../ports/IMessageRepository";
import {RetrieveMessagesWithUserDTO} from "@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserDTO";
import {NotFoundError} from "@/core/shared/exceptions/NotFoundError";
import {
    RetrieveMessagesWithUserPaginatedDTO
} from "@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserPaginatedDTO";

export class RetrieveMessagesWithUserPaginatedCommand implements ICommand<RetrieveMessagesWithUserDTO, Message[]> {
    private repository: IMessageRepository;

    constructor(repository: IMessageRepository) {
        this.repository = repository;
    }

    async run(request: RetrieveMessagesWithUserPaginatedDTO): Promise<Result<Message[]>> {
        try {
            const userId = request.userId;
            const otherUserId = request.targetUserId;
            const after = request.after;  // Timestamp para paginación
            const limit = request.limit ?? 50;  // Límite de mensajes por página (por defecto 50)


            const messages = await this.repository.findMessagesBetweenUsersPaginated(userId, otherUserId, after, limit);

            if (!messages || messages.length === 0) {
                return Result.failure<Message[]>(new NotFoundError('No messages found'));
            }

            return Result.success<Message[]>(messages);
        } catch (error: any) {
            return Result.failure<Message[]>(error);
        }
    }
}
