import WebSocket, {WebSocketServer} from 'ws';
import {WebSocketsClientHandler} from './WebSocketsClientHandler';
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
import { GetUserStatusDTO } from '@/core/uniMatch/status/application/DTO/GetUserStatusDTO';

export class WebSocketController {
    private notificationServer: WebSocketServer;
    private statusServer: WebSocketServer;
    private readonly clientHandler: WebSocketsClientHandler;
    private readonly userHasDisconnectedCommand: UserHasDisconnectedCommand;
    private readonly userIsOnlineCommand: UserIsOnlineCommand;
    private readonly userIsTypingCommand: UserIsTypingCommand;
    private readonly userHasStoppedTypingCommand: UserHasStoppedTypingCommand;
    private readonly getUserStatusCommand: GetUserStatusCommand;

    constructor(
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
                    ws.send(JSON.stringify({type: 'userOnline', userId: client.id}));
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
                        console.log('typingDTO', typingDTO);
                        const command = await this.userIsTypingCommand.run(typingDTO);
                        if (command.isSuccess()) {
                            const targetId = command.getValue();
                            if (targetId) {
                                const targetClient = this.clientHandler.getClient(targetId);
                                if (targetClient?.socket.status) {
                                    targetClient.socket.status.send(JSON.stringify({type: 'typing', userId: targetId}));
                                }
                            }
                        }
                        break;
                    }
            
                    case 'stoppedTyping': {
                        const stoppedTypingDTO: UserHasStoppedTypingDTO = {
                            userId: parsedMessage.userId,
                        };
                        console.log('stoppedTypingDTO', stoppedTypingDTO);
                       const command = await  this.userHasStoppedTypingCommand.run(stoppedTypingDTO);

                       if (command.isSuccess()) {
                            const targetId = command.getValue();
                            if (targetId) {
                                const targetClient = this.clientHandler.getClient(targetId);
                                if (targetClient?.socket.status) {
                                    targetClient.socket.status.send(JSON.stringify({type: 'stoppedTyping', userId: targetId}));
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
                        console.log('getUserStatusDTO', getUserStatusDTO);
                        const result = await this.getUserStatusCommand.run(getUserStatusDTO);
                        const response = {
                            type: 'getUserStatus',
                            status: result.getValue(),
                            userId: parsedMessage.targetId,
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
                        ws.send(JSON.stringify({type: 'userOffline', userId: client.id}));
                    }
                }
            });
        });
    }
}
