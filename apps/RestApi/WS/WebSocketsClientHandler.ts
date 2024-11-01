import WebSocket from 'ws';

interface Client {
    id: string;
    socket: WebSocket;
}

export class WebSocketsClientHandler {
    private clients: Map<string, Client> = new Map();

    addClient(userId: string, socket: WebSocket) {
        this.clients.set(userId, { id: userId, socket });
    }

    removeClient(userId: string) {
        this.clients.delete(userId);
    }

    getClient(userId: string): Client | undefined {
        return this.clients.get(userId);
    }
}
