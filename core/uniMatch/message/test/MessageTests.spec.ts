import { Message } from '@/core/uniMatch/message/domain/Message';
import { MessageStatusEnum } from '@/core/shared/domain/MessageStatusEnum';
import { IMessageRepository } from '../application/ports/IMessageRepository';
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { CreateNewMessageDTO } from '../application/DTO/CreateNewMessageDTO';
import { FileError } from '@/core/shared/exceptions/FileError';
import { CreateNewMessageCommand } from '../application/commands/CreateNewMessageCommand';
import { DeleteAllMessagesWithUserCommand } from '../application/commands/DeleteAllMessagesWithUserCommand';
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

    test("should delete all messages with a user successfully", async () => {
        const createCommand = new CreateNewMessageCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);
        const command = new DeleteAllMessagesWithUserCommand(messageRepositoryMock, eventBusMock, fileHandlerMock);

        const request1: CreateNewMessageDTO = {
            content: "hii, how are you?",
            senderId: "sender123",
            recipientId: "recipient123"
        };

        const request2: CreateNewMessageDTO = {
            content: "finee, thank u",
            senderId: "recipient123",
            recipientId: "sender123"
        };

        const request3: CreateNewMessageDTO = {
            content: "and you?",
            senderId: "recipient123",
            recipientId: "sender123"
        };

        await createCommand.run(request1);
        await createCommand.run(request2);
        await createCommand.run(request3);

        const request = {
            userId: "sender123",
            targetUserId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        // expect(result.getValue()?.content).toBe(request.content);
        // expect(result.getValue()?.sender).toBe(request.senderId);
        // expect(result.getValue()?.recipient).toBe(request.recipientId);
        // expect(messageRepositoryMock.create).toHaveBeenCalledWith(expect.any(Message));
        // expect(eventBusMock.publish).toHaveBeenCalled();
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