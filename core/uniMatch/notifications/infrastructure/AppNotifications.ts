import { Notification } from "@/core/uniMatch/notifications/domain/Notification";
import { IAppNotifications } from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import { WebSocketsAppNotifications } from "@/apps/RestApi/WS/WebSocketsAppNotifications";

export class AppNotifications implements IAppNotifications {
    private webSocketController: WebSocketsAppNotifications;

    constructor(webSocketController: WebSocketsAppNotifications) {
        this.webSocketController = webSocketController;
    }

    async sendNotification(notification: Notification): Promise<void> {
        const client = this.webSocketController.getClient(notification.recipient);
        if (client && client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(JSON.stringify({
                id: notification.contentId,
                type: notification.type,
                status: notification.status,
                date: notification.date,
                payload: notification.payload,
            }));
        } else {
            console.log(`Usuario ${notification.recipient} no conectado.`);
        }
    }

    async sendNotificationToMany(notifications: Notification[]): Promise<void> {
        notifications.forEach(async (notification) => {
            await this.sendNotification(notification);
        });
    }

    async checkNotificationStatus(notification: Notification): Promise<boolean> {
        return !!this.webSocketController.getClient(notification.recipient);
    }
}
