import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageStatusEnum } from '@/core/shared/domain/MessageStatusEnum';
import { IMessageRepository } from '../application/ports/IMessageRepository';
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { CreateNewMessageDTO } from '../application/DTO/CreateNewMessageDTO';
import { FileError } from '@/core/shared/exceptions/FileError';
import { CreateNewMessageCommand } from '../application/commands/CreateNewMessageCommand';
import { DeleteAllMessagesWithUserCommand } from '../application/commands/DeleteAllMessagesWithUserCommand';
import { RetrieveMessagesWithUserCommand } from '../application/commands/RetrieveMessagesWithUserCommand';
import { RetrieveMessagesWithUserPaginatedCommand } from '../application/commands/RetrieveMessagesWithUserPaginatedCommand';
import { RetrieveUserLastMessagesCommand } from '../application/commands/RetrieveUserLastMessagesCommand';
import { UpdateMessageCommand } from '../application/commands/UpdateMessageCommand';
import { Gender } from '@/core/shared/domain/Gender';
import { SexualOrientation } from '../../user/domain/SexualOrientation';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';
import { Profile } from '../../user/domain/Profile';
import { Location } from '@/core/shared/domain/Location';
import { InMemoryMessageRepository } from '../infrastructure/InMemory/InMemoryMessageRepository';

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

    test("should create a new message with a file successfully", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

       const request: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123",
            attachment: new File([""], "image.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()?.content).toBe(request.content);
        expect(result.getValue()?.sender).toBe(request.senderId);
        expect(result.getValue()?.recipient).toBe(request.recipientId);
        // expect(result.getValue()?.attachment).toBe(request.attachment);
        expect(fileHandlerMock.save).toHaveBeenCalled();
        expect(messageRepositoryMock.create).toHaveBeenCalledWith(expect.any(Message));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should return error if file name is empty", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123",
            attachment: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(FileError);
        expect(result.getErrorMessage()).toBe("File name is required");
    });

    test("should return error if message content is empty and no attachment", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "",
            senderId: "sender123",
            recipientId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Message content cannot be empty.");
    });

    test("should return error if message content is empty and no attachment", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "",
            senderId: "sender123",
            recipientId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Message content cannot be empty.");
    });

    /*
    test("should create a new message with a file and no content successfully", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "",
            senderId: "sender123",
            recipientId: "recipient123",
            attachment: new File([""], "image.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()?.content).toBe(request.content);
        expect(result.getValue()?.sender).toBe(request.senderId);
        expect(result.getValue()?.recipient).toBe(request.recipientId);
        expect(fileHandlerMock.save).toHaveBeenCalled();
        expect(messageRepositoryMock.create).toHaveBeenCalledWith(expect.any(Message));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });
    */

    test("should return error if profile repository update fails", async () => {
        const command = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123"
        };

        (messageRepositoryMock.create as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("DeleteAllMessagesWithUserCommand", () => {
    let messageRepository: InMemoryMessageRepository;
    let eventBusMock: IEventBus;
    let fileHandlerMock: IFileHandler;

    beforeEach(() => {
        messageRepository = new InMemoryMessageRepository();

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

    test("should delete all messages with a user successfully", async () => {
        const command = new DeleteAllMessagesWithUserCommand(messageRepository, eventBusMock, fileHandlerMock);

        const createCommand = new CreateNewMessageCommand(messageRepository, eventBusMock, fileHandlerMock);

        const messageRequest1: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123"
        };


        const messageRequest2: CreateNewMessageDTO = {
            content: "fine, and u?",
            senderId: "recipient123",
            recipientId: "sender123"
        };

        await createCommand.run(messageRequest1);
        await createCommand.run(messageRequest2);

        const request = {
            userId: "sender123",
            targetUserId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(eventBusMock.publish).toHaveBeenCalled();
        const messages = await messageRepository.findLastMessagesBetweenUsers(request.userId, request.targetUserId);
        expect(messages).toHaveLength(2);
        messages.forEach(message => {
            expect(message.getIsActive()).toBe(false);
        });
    });
});