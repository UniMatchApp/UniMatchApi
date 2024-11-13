import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { ISessionStatusRepository } from "../ports/ISessionStatusRepository";
import { GetUserStatusDTO } from "../DTO/GetUserStatusDTO";
import { ChatStatusEnum } from "../../domain/enum/ChatStatusEnum";

export class GetUserStatusCommand implements ICommand<GetUserStatusDTO, ChatStatusEnum> {
    private readonly repository: ISessionStatusRepository;

    constructor(repository: ISessionStatusRepository) {
        this.repository = repository;
    }

    async run(request: GetUserStatusDTO): Promise<Result<ChatStatusEnum>> {
        try {
            const targetStatus = await this.repository.findById(request.targetId);

            if (!targetStatus) {
                return Result.success<ChatStatusEnum>(ChatStatusEnum.OFFLINE);
            }

            if (targetStatus.status === ChatStatusEnum.TYPING) {
                if (targetStatus.targetUser === request.userId) {
                    return Result.success<ChatStatusEnum>(ChatStatusEnum.TYPING);
                } else {
                    return Result.success<ChatStatusEnum>(ChatStatusEnum.ONLINE);
                }
            }

            return Result.success<ChatStatusEnum>(targetStatus.status as ChatStatusEnum);
        } catch (error: any) {
            return Result.failure<ChatStatusEnum>(error);
        }
    }
}
