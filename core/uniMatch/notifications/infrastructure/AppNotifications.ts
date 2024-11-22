import {WebSocket} from "ws";
import {Notification} from "@/core/uniMatch/notifications/domain/Notification";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import {WebSocketsClientHandler} from "@/core/shared/infrastructure/clientHandler/WebSocketsClientHandler";

export class AppNotifications implements IAppNotifications {
    private webSocketController: WebSocketsClientHandler;

    constructor(webSocketsNotificationsHandler: WebSocketsClientHandler) {
        this.webSocketController = webSocketsNotificationsHandler;
    }

    async sendNotification(notification: Notification): Promise<void> {
        const client = this.webSocketController.getClient(notification.recipient);


        console.log("Sending notification to user: ", notification.recipient)
        console.log("Client: ", client)


        if (!(client && client.socket.notification?.readyState === WebSocket.OPEN)) {
            console.log(this.constructor.name + ` -> User ${notification.recipient} not connected.`);
            return;
        }

        client.socket.notification.send(JSON.stringify({
            id: notification.getId(),
            contentId: notification.contentId,
            type: notification.type,
            status: notification.status,
            date: notification.date,
            payload: notification.payload,
            recipient: notification.recipient
        }));

        console.log("Notification " +JSON.stringify({
            id: notification.getId(),
            contentId: notification.contentId,
            type: notification.type,
            status: notification.status,
            date: notification.date,
            payload: notification.payload,
            recipient: notification.recipient
        }) + " sent to user: ", notification.recipient)

    }

    async sendNotificationToMany(notifications: Notification[]): Promise<void> {
        for (const notification of notifications) {
            await this.sendNotification(notification);
        }
    }

    async checkNotificationStatus(notification: Notification): Promise<boolean> {
        return !!this.webSocketController.getClient(notification.recipient);
    }
}
