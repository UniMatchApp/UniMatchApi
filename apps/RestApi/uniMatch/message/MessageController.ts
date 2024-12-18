import {Request, Response} from 'express';
import {IEventBus} from "@/core/shared/application/IEventBus";
import {Result} from "@/core/shared/domain/Result";
import {CreateNewMessageCommand} from "@/core/uniMatch/message/application/commands/CreateNewMessageCommand";
import {Message} from "@/core/uniMatch/message/domain/Message";

import {ErrorHandler} from "../../utils/ErrorHandler";
import {
    DeleteAllMessagesWithUserCommand
} from "@/core/uniMatch/message/application/commands/DeleteAllMessagesWithUserCommand";
import {DeleteAllUserMessagesDTO} from '@/core/uniMatch/message/application/DTO/DeleteAllMessagesWithUserDTO';
import {DeleteMessageCommand} from '@/core/uniMatch/message/application/commands/DeleteMessageCommand';
import {DeleteMessageDTO} from '@/core/uniMatch/message/application/DTO/DeleteMessageDTO';
import {MessageHasBeenReadCommand} from '@/core/uniMatch/message/application/commands/MessageHasBeenReadCommand';
import {MessageHasBeenSeenDTO} from '@/core/uniMatch/message/application/DTO/MessageHasBeenSeenDTO';
import {
    RetrieveMessagesWithUserCommand
} from '@/core/uniMatch/message/application/commands/RetrieveMessagesWithUserCommand';
import {RetrieveMessagesWithUserDTO} from '@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserDTO';
import {
    RetrieveMessagesWithUserPaginatedCommand
} from '@/core/uniMatch/message/application/commands/RetrieveMessagesWithUserPaginatedCommand';
import {
    RetrieveMessagesWithUserPaginatedDTO
} from '@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserPaginatedDTO';
import {
    RetrieveUserLastMessagesCommand
} from '@/core/uniMatch/message/application/commands/RetrieveUserLastMessagesCommand';
import {RetrieveUserLastMessagesDTO} from '@/core/uniMatch/message/application/DTO/RetrieveUserLastMessagesDTO';
import {UpdateMessageCommand} from '@/core/uniMatch/message/application/commands/UpdateMessageCommand';
import {UpdateMessageDTO} from '@/core/uniMatch/message/application/DTO/UpdateMessageDTO';
import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import {
    RetrieveMessagesFromUserPaginatedDTO
} from "@/core/uniMatch/message/application/DTO/RetriveMessagesFromUserPaginatedDTO";
import {
    RetrieveMessagesFromUserPaginatedCommand
} from "@/core/uniMatch/message/application/commands/RetrieveMessagesFromUserPaginatedCommand";
import {MessageDTO} from "@/core/uniMatch/message/application/DTO/MessageDTO";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import { MessageHasBeenReceivedCommand } from '@/core/uniMatch/message/application/commands/MessageHasBeenReceivedCommand';
import { MessageHasBeenReceivedDTO } from '@/core/uniMatch/message/application/DTO/MessageHasBeenReceivedDTO';


export class MessageController {

    private readonly messageRepository: IMessageRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: IFileHandler;

    constructor(messageRepository: IMessageRepository,
                eventBus: IEventBus,
                fileHandler: IFileHandler
    ) {
        this.messageRepository = messageRepository;
        this.eventBus = eventBus;
        this.fileHandler = fileHandler;
    }

    async createMessage(req: Request, res: Response): Promise<void> {
        const command = new CreateNewMessageCommand(this.messageRepository, this.eventBus, this.fileHandler);
        return command.run(req.body).then((result: Result<MessageDTO>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteAllMessagesWithUser(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const targetUserId = req.params.targetId;
        const command = new DeleteAllMessagesWithUserCommand(this.messageRepository, this.eventBus, this.fileHandler);
        const dto = {userId: userId, targetUserId: targetUserId} as DeleteAllUserMessagesDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async deleteMessage(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const messageId = req.params.messageId;
        const deleteForBoth = Boolean(req.query.deleteForBoth === 'true');
        const command = new DeleteMessageCommand(this.messageRepository, this.eventBus, this.fileHandler);
        const dto = {userId: userId, messageId: messageId, deleteForBoth: deleteForBoth} as DeleteMessageDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async messageHasBeenRead(req: Request, res: Response): Promise<void> {
        const messageId = req.params.messageId;
        const userId = req.body.userId;
        const command = new MessageHasBeenReadCommand(this.messageRepository, this.eventBus);
        const dto = {messageId: messageId, userId: userId} as MessageHasBeenSeenDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async retrieveMessagesWithUser(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const targetUserId = req.params.targetId;
        const command = new RetrieveMessagesWithUserCommand(this.messageRepository);
        const dto = {userId: userId, targetUserId: targetUserId} as RetrieveMessagesWithUserDTO;
        return command.run(dto).then((result: Result<Message[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }


    async retrieveMessagesFromUserPaginated(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const {after, limit} = req.query;
        const command = new RetrieveMessagesFromUserPaginatedCommand(this.messageRepository);
        const dto = {
            userId: userId,
            after: Number(after),
            limit: Number(limit)
        } as RetrieveMessagesFromUserPaginatedDTO;
        return command.run(dto).then((result: Result<MessageDTO[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async retrieveMessagesWithUserPaginated(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const targetUserId = req.params.targetId;
        const {after, limit} = req.query;
        const command = new RetrieveMessagesWithUserPaginatedCommand(this.messageRepository);
        const dto = {
            userId: userId,
            targetUserId: targetUserId,
            after: Number(after),
            limit: Number(limit)
        }
        return command.run(dto).then((result: Result<Message[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async retrieveUserLastMessages(req: Request, res: Response): Promise<void> {
        const userId = req.body.userId;
        const command = new RetrieveUserLastMessagesCommand(this.messageRepository);
        const dto = {userId: userId} as RetrieveUserLastMessagesDTO;
        return command.run(dto).then((result: Result<Message[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async updateMessage(req: Request, res: Response): Promise<void> {
        const messageId = req.params.messageId;
        const userId = req.body.userId;

        const command = new UpdateMessageCommand(this.messageRepository, this.eventBus, this.fileHandler);
        const dto = {messageId: messageId, userId: userId, ...req.body} as UpdateMessageDTO;
        return command.run(dto).then((result: Result<MessageDTO>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async messageHasBeenReceived(req: Request, res: Response): Promise<void> {
        const messageId = req.params.messageId;
        const userId = req.body.userId;
        const command = new MessageHasBeenReceivedCommand(this.messageRepository, this.eventBus);
        const dto = {messageId: messageId, userId: userId} as MessageHasBeenReceivedDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

}