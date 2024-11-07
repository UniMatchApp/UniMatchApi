import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageStatusEnum } from '@/core/shared/domain/MessageStatusEnum';
import { IMessageRepository } from '../application/ports/IMessageRepository';
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { CreateNewMessageDTO } from '../application/DTO/CreateNewMessageDTO';
import { CreateNewMessageCommand } from '../application/commands/CreateNewMessageCommand';
// import { DeleteAllMessagesWithUser } from '../application/commands/DeleteAllMessagesWithUser';
import { RetrieveMessagesWithUserCommand } from '../application/commands/RetrieveMessagesWithUserCommand';
import { RetrieveMessagesWithUserPaginatedCommand } from '../application/commands/RetrieveMessagesWithUserPaginatedCommand';
import { RetrieveUserLastMessagesCommand } from '../application/commands/RetrieveUserLastMessagesCommand';
import { UpdateMessageCommand } from '../application/commands/UpdateMessageCommand';

describe("CreateNewMessageCommand", () => {
    let messageRepositoryMock: IMessageRepository;
    let eventBusMock: IEventBus;
    let fileHandlerMock: IFileHandler;

    beforeEach(() => {
        messageRepositoryMock = {
            findLastMessagesOfUser: jest.fn(),
            findLastMessagesBetweenUsers: jest.fn(),
            findMessagesBetweenUsersPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
        
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn()
        };

    });

    test("should create a new message successfully", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()?.content).toBe(request.content);
        expect(result.getValue()?.sender).toBe(request.senderId);
        expect(result.getValue()?.recipient).toBe(request.recipientId);
        expect(messageRepositoryMock.create).toHaveBeenCalledWith(expect.any(Message));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });
});