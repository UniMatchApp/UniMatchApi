import { WebSocket } from "ws";
import { Notification } from "@/core/uniMatch/notifications/domain/Notification";
import { IAppNotifications } from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import { WebSocketsClientHandler } from "@/core/shared/infrastructure/clientHandler/WebSocketsClientHandler";
import fetch from "node-fetch";
import { NotificationTypeEnum } from "../domain/enum/NotificationTypeEnum";
import { AppNotificationPayload } from "../domain/entities/AppNotificationPayload";
import { EventNotificationPayload } from "../domain/entities/EventNotificationPayload";
import { MatchNotificationPayload } from "../domain/entities/MatchNotificationPayload";
import { MessageNotificationPayload } from "../domain/entities/MessageNotificationPayload";
import { INotificationTokenProvider } from "../application/ports/INotificationTokenProvider";

export class AppNotifications implements IAppNotifications {
    private webSocketController: WebSocketsClientHandler;
    private notificationTokenProvider: INotificationTokenProvider;

    constructor(webSocketsNotificationsHandler: WebSocketsClientHandler, notificationTokenProvider: INotificationTokenProvider) {
        this.webSocketController = webSocketsNotificationsHandler;
        this.notificationTokenProvider = notificationTokenProvider;
    }

    async sendNotification(notification: Notification, recipient?: string): Promise<void> {
        const client = this.webSocketController.getClient(recipient || notification.recipient);
        const fcmToken = await this.notificationTokenProvider.getNotificationToken(notification.recipient);

        if (client && client.socket.notification?.readyState === WebSocket.OPEN) {
            client.socket.notification.send(JSON.stringify({
                id: notification.getId(),
                contentId: notification.contentId,
                status: notification.status,
                date: notification.date,
                payload: notification.payload,
                recipient: notification.recipient
            }));
        } else if (fcmToken) {
            await this.sendPushNotification(notification, fcmToken);
        }
    }

    async sendNotificationToMany(notifications: Notification[]): Promise<void> {
        for (const notification of notifications) {
            await this.sendNotification(notification);
        }
    }

    async checkNotificationStatus(notification: Notification): Promise<boolean> {
        return !!this.webSocketController.getClient(notification.recipient);
    }

    async sendPushNotification(notification: Notification, fcmToken: string): Promise<void> {
        let title = "Notification";
        let body = "You have a new notification";
        let sender = undefined;
        const firebaseServerKey = await this.notificationTokenProvider.generateServerKey();
    
        switch (notification.payload.type) {
            case NotificationTypeEnum.APP:
                const appPayload = notification.payload as AppNotificationPayload;
                title = appPayload.title;
                body = appPayload.description;
                break;
    
            case NotificationTypeEnum.EVENT:
                const eventPayload = notification.payload as EventNotificationPayload;
                title = eventPayload.title;
                body = `Event status: ${eventPayload.status}`;
                break;
    
            case NotificationTypeEnum.MATCH:
                const matchPayload = notification.payload as MatchNotificationPayload;
                title = "New Match!";
                body = `Somebody has ${matchPayload.isLiked ? "liked" : "disliked"} you!`;
                sender = matchPayload.userMatched;
                break;
    
            case NotificationTypeEnum.MESSAGE:
                const messagePayload = notification.payload as MessageNotificationPayload;
                title = 'You have received a new message';
                body = messagePayload.content;
                sender = messagePayload.sender;
                break;
    
            default:
                console.warn("Unknown notification type:", notification.payload.type);
                break;
        }
    
        const payload = {
            message: {
                token: fcmToken,
                data: {
                    title,
                    body,
                    id: notification.getId(),
                    contentId: notification.contentId,
                    status: notification.status,
                    date: notification.date,
                    recipient: notification.recipient,
                    type: notification.payload.type,
                    sender
                },
            },
        };
    
        const response = await fetch("https://fcm.googleapis.com/v1/projects/272536925458/messages:send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${firebaseServerKey}`,
            },
            body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            console.error("Failed to send push notification:", await response.text());
        }
    }
    
}
