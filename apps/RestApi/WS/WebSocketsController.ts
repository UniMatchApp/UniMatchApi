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
        this.notificationServer = new WebSocketServer({port: notificationPort, path: '/notifications'});
        this.statusServer = new WebSocketServer({port: statusPort, path: '/status'});
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

            ws.on('message', async (message: string) => {
                const parsedMessage = JSON.parse(message);
            
                switch (parsedMessage.type) {
                    case 'typing': {
                        const typingDTO: UserIsTypingDTO = {
                            userId: parsedMessage.userId,
                            targetUserId: parsedMessage.targetUserId,
                        };
                        this.userIsTypingCommand.run(typingDTO);
                        break;
                    }
            
                    case 'stoppedTyping': {
                        const stoppedTypingDTO: UserHasStoppedTypingDTO = {
                            userId: parsedMessage.userId,
                        };
                        this.userHasStoppedTypingCommand.run(stoppedTypingDTO);
                        break;
                    }
            
                    case 'getUserStatus': {
                        const getUserStatusDTO = {
                            userId: parsedMessage.userId,
                            targetId: parsedMessage.targetUserId,
                        } as GetUserStatusDTO;
                        const result = await this.getUserStatusCommand.run(getUserStatusDTO);
                        ws.send(JSON.stringify(result));
                        break;
                    }
            
                    default:
                        console.warn('Unknown message type:', parsedMessage.type);
                }
            });
            

            ws.on('close', () => {
                const userDisconnectedDTO: UserHasDisconnectedDTO = {userId};
                this.userHasDisconnectedCommand.run(userDisconnectedDTO);
                this.clientHandler.removeClient(userId);
            });
        });
    }
}
