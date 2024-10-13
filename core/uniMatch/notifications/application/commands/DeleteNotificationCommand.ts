import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { DeleteNotificationDTO } from "../DTO/DeleteNotificationDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";

export class DeleteNotificationCommand implements ICommand<DeleteNotificationDTO, void> {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    run(request: DeleteNotificationDTO): Result<void> {
        try {

            const notification = this.repository.findById(request.notificationId);

            if (!notification) {
                return Result.failure<void>("Notification not found");
            }

            this.repository.deleteById(request.notificationId);

            return Result.success<void>(undefined);
        } catch (error : any) {
            return Result.failure<void>(error);
        }
    }
}
