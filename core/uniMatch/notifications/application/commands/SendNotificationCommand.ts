import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Notification } from "../../domain/Notification";
import { SendNotificationDTO } from "../DTO/SendNotificationDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";

export class SendNotificationCommand implements ICommand<SendNotificationDTO, Notification> {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    run(request: SendNotificationDTO): Result<Notification> {
        try {
            const notification = new Notification(
                request.type,
                request.message,
                new Date(),
                request.recipient
            );

            this.repository.save(notification);

            return Result.success<Notification>(notification);
        } catch (error : any) {
            return Result.failure<Notification>(error);
        }
    }
}
