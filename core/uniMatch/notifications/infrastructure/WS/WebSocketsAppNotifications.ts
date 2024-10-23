import { Notification } from "@/core/uniMatch/notifications/domain/Notification";
import WebSocket, { WebSocketServer } from 'ws';
import { IAppNotifications } from "../../application/ports/IAppNotifications";

interface Client {
    id: string;
    socket: WebSocket;
}

export class WebSocketAppNotifications implements IAppNotifications {
    private clients: Map<string, Client> = new Map();

    constructor() {
        const wss = new WebSocketServer({ port: 8080 });

        wss.on('connection', (ws: WebSocket, req) => {
            const userId = req.url?.split('/').pop();
            if (userId) {
                this.clients.set(userId, { id: userId, socket: ws });

                ws.on('message', (message: string) => {
                    console.log(`Mensaje recibido de ${userId}: ${message}`);
                });

                ws.on('close', () => {
                    this.clients.delete(userId);
                });
            }
        });
    }

    async sendNotification(notification: Notification): Promise<void> {
        const client = this.clients.get(notification.recipient);
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
        const client = this.clients.get(notification.recipient);
        return !!client;
    }
}
