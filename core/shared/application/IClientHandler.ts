import {WebSocket} from "ws";

export interface Sockets {
    notification?: WebSocket;
    status?: WebSocket;
}

export interface Client {
    id: string;
    socket: Sockets;
}

export interface IClientHandler {
    addClient(userId: string, socket: Partial<Sockets>): void;

    getAllClients(): Client[];

    removeClient(userId: string): void;

    getClient(userId: string): Client | undefined;
}