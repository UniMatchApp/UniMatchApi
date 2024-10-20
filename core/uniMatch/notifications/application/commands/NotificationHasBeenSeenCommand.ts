import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { NotificationHasBeenSeenDTO } from "../DTO/NotificationHasBeenSeenDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { MessageStatusEnum } from "@/core/shared/domain/MessageStatusEnum";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";


export class NotificationHasBeenSeenCommand implements ICommand<NotificationHasBeenSeenDTO, void> {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    async run(request: NotificationHasBeenSeenDTO): Promise<Result<void>> {
        try {
            const notification = await this.repository.findById(request.notificationId);

            if (!notification) {
                return Result.failure<void>(new NotFoundError('Notification not found'));
            }

            notification.status = MessageStatusEnum.READ;
            await this.repository.save(notification);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
