import { Request, Response } from 'express';    
import { IEventBus } from "@/core/shared/application/IEventBus";
import { INotificationsRepository } from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import { DeleteAllNotificationsCommand } from '@/core/uniMatch/notifications/application/commands/DeleteAllNotificationsCommand';
import { DeleteAllNotificationsDTO } from '@/core/uniMatch/notifications/application/DTO/DeleteAllNotificationsDTO';
import { Result } from '@/core/shared/domain/Result';
import { ErrorHandler } from '../../utils/ErrorHandler';
import { DeleteNotificationCommand } from '@/core/uniMatch/notifications/application/commands/DeleteNotificationCommand';
import { DeleteNotificationDTO } from '@/core/uniMatch/notifications/application/DTO/DeleteNotificationDTO';
import { NotificationHasBeenSeenCommand } from '@/core/uniMatch/notifications/application/commands/NotificationHasBeenSeenCommand';
import { NotificationHasBeenSeenDTO } from '@/core/uniMatch/notifications/application/DTO/NotificationHasBeenSeenDTO';
import { GetAllNotificationsCommand } from '@/core/uniMatch/notifications/application/commands/GetAllNotificationsCommand';
import { GetAllNotificationsDTO } from '@/core/uniMatch/notifications/application/DTO/GetAllNotificationsDTO';
import { Notification } from '@/core/uniMatch/notifications/domain/Notification';
import { IAppNotifications } from '@/core/uniMatch/notifications/application/ports/IAppNotifications';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';

export class NotificationsController {

    private readonly notificationsRepository: INotificationsRepository;
    private readonly eventBus: IEventBus;
    private readonly appNotifications: IAppNotifications;
    private readonly emailNotifications: IEmailNotifications;

    constructor(
        notificationsRepository: INotificationsRepository, 
        eventBus: IEventBus, 
        appNotifications: IAppNotifications,
        emailNotifications: IEmailNotifications
    ) {
        this.notificationsRepository = notificationsRepository;
        this.eventBus = eventBus;
        this.appNotifications = appNotifications;
        this.emailNotifications = emailNotifications;
    }


    async deletedAllNotifications(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const command = new DeleteAllNotificationsCommand(this.notificationsRepository);
        const dto = { userId: userId } as DeleteAllNotificationsDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteNotification(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const notificationId = req.body.notificationId;
        const command = new DeleteNotificationCommand(this.notificationsRepository);
        const dto = { userId: userId, notificationId: notificationId } as DeleteNotificationDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async NotificationHasBeenSeen(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const notificationId = req.body.notificationId;
        const command = new NotificationHasBeenSeenCommand(this.notificationsRepository);
        const dto = { userId: userId, notificationId: notificationId } as NotificationHasBeenSeenDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async getAllNotifications(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const command = new GetAllNotificationsCommand(this.notificationsRepository);
        const dto = { userId: userId } as GetAllNotificationsDTO;
        return command.run(dto).then((result: Result<Notification[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

}