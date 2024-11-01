import {Notification} from "@/core/uniMatch/notifications/domain/Notification";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import {WebSocketsClientHandler} from "@/apps/RestApi/WS/WebSocketsClientHandler";

export class AppNotifications implements IAppNotifications {
    private webSocketController: WebSocketsClientHandler;

    constructor(webSocketsNotificationsHandler: WebSocketsClientHandler) {
        this.webSocketController = webSocketsNotificationsHandler;
    }

    async sendNotification(notification: Notification): Promise<void> {
        const client = this.webSocketController.getClient(notification.recipient);
        if (!(client && client.socket.readyState === WebSocket.OPEN)) {
            console.log(`Usuario ${notification.recipient} no conectado.`);
            return;
        }
        client.socket.send(JSON.stringify({
            id: notification.contentId,
            type: notification.type,
            status: notification.status,
            date: notification.date,
            payload: notification.payload,
        }));

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
