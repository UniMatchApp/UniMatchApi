import { ICommand } from "../../../../shared/application/ICommand";
import { Result } from "../../../../shared/domain/Result";
import { NotificationHasBeenSeenDTO } from "../DTO/NotificationHasBeenSeenDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { StatusEnum } from "../../../../shared/domain/StatusEnum";


export class NotificationHasBeenSeenCommand implements ICommand<NotificationHasBeenSeenDTO, void> {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    run(request: NotificationHasBeenSeenDTO): Result<void> {
        try {
            const notification = this.repository.findById(request.notificationId);

            if (!notification) {
                return Result.failure<void>("Notification not found");
            }

            notification.status = StatusEnum.READ;
            this.repository.save(notification);

            return Result.success<void>(undefined);
        } catch (error) {
            return Result.failure<void>(error);
        }
    }
}
