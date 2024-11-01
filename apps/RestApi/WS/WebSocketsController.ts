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

export class WebSocketController {
    private wss: WebSocketServer;
    private readonly clientHandler: WebSocketsClientHandler;
    private readonly userHasDisconnectedCommand: UserHasDisconnectedCommand;
    private readonly userIsOnlineCommand: UserIsOnlineCommand;
    private readonly userIsTypingCommand: UserIsTypingCommand;
    private readonly userHasStoppedTypingCommand: UserHasStoppedTypingCommand;

    constructor(port: number,
                repository: ISessionStatusRepository,
                clientHandler: WebSocketsClientHandler
    ) {
        this.wss = new WebSocketServer({port});
        this.clientHandler = clientHandler;

        this.userHasDisconnectedCommand = new UserHasDisconnectedCommand(repository);
        this.userIsOnlineCommand = new UserIsOnlineCommand(repository);
        this.userIsTypingCommand = new UserIsTypingCommand(repository);
        this.userHasStoppedTypingCommand = new UserHasStoppedTypingCommand(repository);

        this.wss.on('connection', (ws: WebSocket, req) => {
            const userId = req.url?.split('/').pop();
            if (!userId) {
                ws.close();
                return;
            }

            const userOnlineDTO: UserIsOnlineDTO = {userId};
            this.userIsOnlineCommand.run(userOnlineDTO);
            this.clientHandler.addClient(userId, ws);

            ws.on('message', (message: string) => {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === 'typing') {
                    const typingDTO: UserIsTypingDTO = {
                        userId: parsedMessage.userId,
                        targetUserId: parsedMessage.targetUserId,
                    };
                    this.userIsTypingCommand.run(typingDTO);

                } else if (parsedMessage.type === 'stoppedTyping') {
                    const stoppedTypingDTO: UserHasStoppedTypingDTO = {
                        userId: parsedMessage.userId,
                    };
                    this.userHasStoppedTypingCommand.run(stoppedTypingDTO);
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
