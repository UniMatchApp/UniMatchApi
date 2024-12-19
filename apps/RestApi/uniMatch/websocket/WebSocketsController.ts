import WebSocket, {WebSocketServer} from 'ws';
import {WebSocketsClientHandler} from '@/core/shared/infrastructure/clientHandler/WebSocketsClientHandler';
import {UserHasStoppedTypingDTO} from '@/core/uniMatch/status/application/DTO/UserHasStoppedTypingDTO';
import {UserHasDisconnectedCommand} from '@/core/uniMatch/status/application/commands/UserHasDisconnectedCommand';
import {UserIsOnlineCommand} from '@/core/uniMatch/status/application/commands/UserIsOnlineCommand';
import {UserIsTypingCommand} from '@/core/uniMatch/status/application/commands/UserIsTypingCommand';
import {UserHasDisconnectedDTO} from '@/core/uniMatch/status/application/DTO/UserHasDisconnectedDTO';
import {UserIsOnlineDTO} from '@/core/uniMatch/status/application/DTO/UserIsOnlineDTO';
import {UserIsTypingDTO} from '@/core/uniMatch/status/application/DTO/UserIsTypingDTO';
import {ISessionStatusRepository} from '@/core/uniMatch/status/application/ports/ISessionStatusRepository';
import {UserHasStoppedTypingCommand} from '@/core/uniMatch/status/application/commands/UserHasStoppedTypingCommand';
import {GetUserStatusCommand} from '@/core/uniMatch/status/application/commands/GetUserStatusCommand';
import {GetUserStatusDTO} from '@/core/uniMatch/status/application/DTO/GetUserStatusDTO';

export class WebSocketController {
    private notificationServer: WebSocketServer;
    private statusServer: WebSocketServer;
    private readonly clientHandler: WebSocketsClientHandler;
    private readonly userHasDisconnectedCommand: UserHasDisconnectedCommand;
    private readonly userIsOnlineCommand: UserIsOnlineCommand;
    private readonly userIsTypingCommand: UserIsTypingCommand;
    private readonly userHasStoppedTypingCommand: UserHasStoppedTypingCommand;
    private readonly getUserStatusCommand: GetUserStatusCommand;

    public static start(notificationPort: number, statusPort: number,
                        sessionStatusRepository: ISessionStatusRepository,
                        wsClientHandler: WebSocketsClientHandler
    ): WebSocketController {
        return new WebSocketController(notificationPort, statusPort, sessionStatusRepository, wsClientHandler);
    }


    private constructor(
        notificationPort: number,
        statusPort: number,
        repository: ISessionStatusRepository,
        clientHandler: WebSocketsClientHandler
    ) {
        this.notificationServer = new WebSocketServer({port: notificationPort});
        this.statusServer = new WebSocketServer({port: statusPort});
        this.clientHandler = clientHandler;

        this.userHasDisconnectedCommand = new UserHasDisconnectedCommand(repository);
        this.userIsOnlineCommand = new UserIsOnlineCommand(repository);
        this.userIsTypingCommand = new UserIsTypingCommand(repository);
        this.userHasStoppedTypingCommand = new UserHasStoppedTypingCommand(repository);
        this.getUserStatusCommand = new GetUserStatusCommand(repository);

        this.notificationServer.on('connection', (ws: WebSocket, req) => {
            const userId = req.url?.split('/').pop();
            console.log('Notification websocket -> user connected:', userId)
            if (!userId) {
                ws.close();
                return;
            }

            this.clientHandler.addClient(userId, {notification: ws});

            ws.on('close', () => {
                this.clientHandler.removeClient(userId);
            });
        });

        this.statusServer.on('connection', (ws: WebSocket, req) => {
            const userId = req.url?.split('/').pop();
            console.log('Status websocket -> user connected:', userId)
            if (!userId) {
                ws.close();
                return;
            }

            const userOnlineDTO: UserIsOnlineDTO = {userId};
            this.userIsOnlineCommand.run(userOnlineDTO);
            this.clientHandler.addClient(userId, {status: ws});

            const clients = this.clientHandler.getAllClients();

            for (const client of clients) {
                if (client.id !== userId) {
                    if (client.socket.status) {
                        client.socket.status.send(JSON.stringify({type: 'userOnline', userId}));
                    }
                }
            }

            ws.on('message', async (message: string) => {
                const parsedMessage = JSON.parse(message);
                switch (parsedMessage.type) {
                    case 'typing': {
                        const typingDTO: UserIsTypingDTO = {
                            userId: parsedMessage.userId,
                            targetUserId: parsedMessage.targetUserId,
                        };
                        const command = await this.userIsTypingCommand.run(typingDTO);
                        if (command.isSuccess()) {
                            const targetId = command.getValue();
                            if (targetId) {
                                const targetClient = this.clientHandler.getClient(targetId);
                                if (targetClient?.socket.status) {
                                    targetClient.socket.status.send(JSON.stringify({type: 'typing', userId: userId}));
                                }
                            }
                        }else{
                            console.error('Error:', command.getError());
                        }
                        break;
                    }

                    case 'stoppedTyping': {
                        const stoppedTypingDTO: UserHasStoppedTypingDTO = {
                            userId: parsedMessage.userId,
                        };
                        const command = await this.userHasStoppedTypingCommand.run(stoppedTypingDTO);

                        if (command.isSuccess()) {
                            const targetId = command.getValue();
                            if (targetId) {
                                const targetClient = this.clientHandler.getClient(targetId);
                                if (targetClient?.socket.status) {
                                    targetClient.socket.status.send(JSON.stringify({
                                        type: 'stoppedTyping',
                                        userId: userId,
                                    }));
                                }
                            }
                        }
                        break;
                    }

                    case 'getUserStatus': {
                        const getUserStatusDTO = {
                            userId: parsedMessage.userId,
                            targetId: parsedMessage.targetUserId,
                        } as GetUserStatusDTO;
                        const result = await this.getUserStatusCommand.run(getUserStatusDTO);
                        const response = {
                            type: 'getUserStatus',
                            status: result.getValue(),
                            userId: parsedMessage.targetUserId,
                        };
                        ws.send(JSON.stringify(response));
                        break;
                    }

                    default:
                        console.warn('Unknown message type:', parsedMessage.type);
                }
            });


            ws.on('close', () => {
                console.log('User disconnected:', userId);
                const userDisconnectedDTO: UserHasDisconnectedDTO = {userId};
                this.userHasDisconnectedCommand.run(userDisconnectedDTO);
                this.clientHandler.removeClient(userId);

                const clients = this.clientHandler.getAllClients();
                for (const client of clients) {
                    if (client.id !== userId) {
                        if (client.socket.status) {
                            client.socket.status.send(JSON.stringify({type: 'userOffline', userId}));
                        }
                    }
                }
            });
        });
    }
}
