import { ICommand } from "@/core/shared/application/ICommand";
import { GetAllNotificationsDTO } from "../DTO/GetAllNotificationsDTO";
import { Notification } from "../../domain/Notification";
import { NotificationDTO } from "../DTO/NotificationDTO";
import { INotificationsRepository } from "../ports/INotificationsRepository";
import { Result } from "@/core/shared/domain/Result";

export class GetAllNotificationsCommand implements ICommand<GetAllNotificationsDTO, NotificationDTO[]> {
    private readonly repository: INotificationsRepository;

    constructor(repository: INotificationsRepository) {
        this.repository = repository;
    }

    async run(request: GetAllNotificationsDTO): Promise<Result<NotificationDTO[]>> {
        try {
            const notifications = await this.repository.getAllNotifications(request.userId);

            const notificationDTOs: NotificationDTO[] = notifications.map((notification: Notification) => ({
                id: notification.getId(),
                status: notification.status,
                date: notification.date,
                recipient: notification.recipient,
                contentId: notification.contentId,
                payload: notification.payload,
            }));

            return Result.success<NotificationDTO[]>(notificationDTOs);
        } catch (error: any) {
            console.log("notificaciones error: ", error);
            return Result.failure<NotificationDTO[]>(error);
        }
    }
}
