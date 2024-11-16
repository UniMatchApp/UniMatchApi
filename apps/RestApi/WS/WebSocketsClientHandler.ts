import WebSocket from 'ws';

interface Sockets {
    notification?: WebSocket;
    status?: WebSocket;
}

interface Client {
    id: string;
    socket: Sockets;
}

export class WebSocketsClientHandler {
    private clients: Map<string, Client> = new Map();

    addClient(userId: string, socket: Partial<Sockets>) {
        const existingClient = this.clients.get(userId);

        const notificationSocket = socket.notification || existingClient?.socket.notification;
        const statusSocket = socket.status || existingClient?.socket.status;
        
        this.clients.set(userId, { id: userId, socket: { notification: notificationSocket, status: statusSocket } });
    }

    getAllClients(): Client[] {
        return Array.from(this.clients.values());
    }

    removeClient(userId: string) {
        this.clients.delete(userId);
    }

    getClient(userId: string): Client | undefined {
        return this.clients.get(userId);
    }
}
