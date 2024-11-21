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
import { DeletedMessageEventHandler } from '@/core/uniMatch/notifications/application/handlers/DeletedMessageEventHandler';
import { IAppNotifications } from '@/core/uniMatch/notifications/application/ports/IAppNotifications';
import { EditMessageEventHandler } from '@/core/uniMatch/notifications/application/handlers/EditMessageEventHandler';
import { EventIsDeletedEventHandler } from '@/core/uniMatch/notifications/application/handlers/EventIsDeletedEventHandler';
import { EventIsGoingToExpireEventHandler } from '@/core/uniMatch/notifications/application/handlers/EventIsGoingToExpireEventHandler';
import { EventIsModifiedEventHandler } from '@/core/uniMatch/notifications/application/handlers/EventIsModifiedEventHandler';
import { NewDislikeEventHandler } from '@/core/uniMatch/notifications/application/handlers/NewDislikeEventHandler';
import { NewLikeEventHandler } from '@/core/uniMatch/notifications/application/handlers/NewLikeEventHandler';
import { NewMessageEventHandler } from '@/core/uniMatch/notifications/application/handlers/NewMessageEventHandler';
import { UserHasChangedAgeEventHandler } from '@/core/uniMatch/matching/application/handlers/UserHasChangedAgeEventHandler';
import { UserHasChangedEmailEventHandler } from '@/core/uniMatch/notifications/application/handlers/UserHasChangedEmailEventHandler';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';
import { UserHasChangedPasswordEventHandler } from '@/core/uniMatch/notifications/application/handlers/UserHasChangedPasswordEventHandler';

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
        this.eventBus.subscribe(new DeletedMessageEventHandler(this.appNotifications, this.notificationsRepository));
        this.eventBus.subscribe(new EditMessageEventHandler(this.appNotifications, this.notificationsRepository));
        this.eventBus.subscribe(new EventIsDeletedEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new EventIsGoingToExpireEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new EventIsModifiedEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewDislikeEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewLikeEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewMessageEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new UserHasChangedEmailEventHandler(this.notificationsRepository, this.emailNotifications));
        this.eventBus.subscribe(new UserHasChangedPasswordEventHandler(this.notificationsRepository, this.emailNotifications));
    }


    async deletedAllNotifications(req: Request, res: Response): Promise<void> {
        var userId = req.params.userId;
        var command = new DeleteAllNotificationsCommand(this.notificationsRepository);
        var dto = { userId: userId } as DeleteAllNotificationsDTO;
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
        var userId = req.params.userId;
        var notificationId = req.body.notificationId;
        var command = new DeleteNotificationCommand(this.notificationsRepository);
        var dto = { userId: userId, notificationId: notificationId } as DeleteNotificationDTO;
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
        var userId = req.params.userId;
        var notificationId = req.body.notificationId;
        var command = new NotificationHasBeenSeenCommand(this.notificationsRepository);
        var dto = { userId: userId, notificationId: notificationId } as NotificationHasBeenSeenDTO;
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
        var userId = req.params.userId;
        var command = new GetAllNotificationsCommand(this.notificationsRepository);
        var dto = { userId: userId } as GetAllNotificationsDTO;
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