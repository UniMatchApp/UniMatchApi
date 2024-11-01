import WebSocket, { WebSocketServer } from 'ws';

interface Client {
    id: string;
    socket: WebSocket;
}

export class WebSocketsAppNotifications {
    private clients: Map<string, Client> = new Map();
    private wss: WebSocketServer;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });

        this.wss.on('connection', (ws: WebSocket, req) => {
            const userId = req.url?.split('/').pop();
            if (userId) {
                this.addClient(userId, ws);

                ws.on('close', () => {
                    this.removeClient(userId);
                });
            }
        });
    }

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
