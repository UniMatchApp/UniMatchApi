import { Message } from '@/core/uniMatch/message/domain/Message';
import { IMessageRepository } from '../application/ports/IMessageRepository';
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { CreateNewMessageDTO } from '../application/DTO/CreateNewMessageDTO';
import { RetrieveMessagesWithUserPaginatedDTO } from "@/core/uniMatch/message/application/DTO/RetriveMessagesWithUserPaginatedDTO";
import { FileError } from '@/core/shared/exceptions/FileError';
import { CreateNewMessageCommand } from '../application/commands/CreateNewMessageCommand';
import { DeleteAllMessagesWithUserCommand } from '../application/commands/DeleteAllMessagesWithUserCommand';
import { DeleteMessageCommand } from '../application/commands/DeleteMessageCommand';
import { MessageHasBeenReadCommand } from '../application/commands/MessageHasBeenReadCommand';
import { RetrieveMessagesWithUserCommand } from '../application/commands/RetrieveMessagesWithUserCommand';
import { RetrieveMessagesWithUserPaginatedCommand } from '../application/commands/RetrieveMessagesWithUserPaginatedCommand';
import { RetrieveUserLastMessagesCommand } from '../application/commands/RetrieveUserLastMessagesCommand';
import { UpdateMessageCommand } from '../application/commands/UpdateMessageCommand';
import { InMemoryMessageRepository } from '../infrastructure/InMemory/InMemoryMessageRepository';
import { UpdateMessageDTO } from '../application/DTO/UpdateMessageDTO';

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

    test("should delete all messages with an user successfully", async () => {
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

        const messages = await messageRepository.findLastMessagesBetweenUsers(request.userId, request.targetUserId);
        expect(messages[0].deletedStatus).toBe("NOT_DELETED");
        expect(messages[1].deletedStatus).toBe("NOT_DELETED");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(eventBusMock.publish).toHaveBeenCalled();
        expect(messages).toHaveLength(2);
        messages.forEach(message => {
            expect(message.getIsActive()).toBe(false);
            expect(message.deletedStatus).toBe("DELETED_FOR_BOTH");
        });
    });

    test("should return error if there are no messages", async () => {
        const command = new DeleteAllMessagesWithUserCommand(messageRepository, eventBusMock, fileHandlerMock);

        const request = {
            userId: "sender123",
            targetUserId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("No messages found");
    });
});

describe("DeleteMessageCommand", () => {
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

    test("should delete a message by sender successfully", async () => {
        const command = new DeleteMessageCommand(messageRepository, eventBusMock, fileHandlerMock);

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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request = {
            userId: "sender123",
            messageId: firstMessageId
        };
        
        expect(allMessages[0].deletedStatus).toBe("NOT_DELETED");
        expect(allMessages[1].deletedStatus).toBe("NOT_DELETED");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(eventBusMock.publish).toHaveBeenCalled();
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].getIsActive()).toBe(false);
        expect(allMessages[0].deletedStatus).toBe("DELETED_FOR_BOTH");
        expect(allMessages[1].deletedStatus).toBe("NOT_DELETED");
    });

    test("should delete a message by recipient successfully", async () => {
        const command = new DeleteMessageCommand(messageRepository, eventBusMock, fileHandlerMock);

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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request = {
            userId: "recipient123",
            messageId: firstMessageId
        };
        
        expect(allMessages[0].deletedStatus).toBe("NOT_DELETED");
        expect(allMessages[1].deletedStatus).toBe("NOT_DELETED");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(eventBusMock.publish).toHaveBeenCalled();
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].getIsActive()).toBe(false);
        expect(allMessages[0].deletedStatus).toBe("DELETED_BY_RECIPIENT");
        expect(allMessages[1].deletedStatus).toBe("NOT_DELETED");
    });

    test("should return error is message not found", async () => {
        const command = new DeleteMessageCommand(messageRepository, eventBusMock, fileHandlerMock);

        const request = {
            userId: "recipient123",
            messageId: "123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Message not found");
    });

    test("should return error if user is not allowed", async () => {
        const command = new DeleteMessageCommand(messageRepository, eventBusMock, fileHandlerMock);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request = {
            userId: "recipient124",
            messageId: firstMessageId
        };
        
        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(ValidationError);
        expect(result.getErrorMessage()).toBe("User is not allowed to delete this message");
    });
});

describe("MessageHasBeenReadCommand", () => {
    let messageRepository: InMemoryMessageRepository;
    let eventBusMock: IEventBus;
    let fileHandlerMock: IFileHandler;

    beforeEach(() => {
        messageRepository = new InMemoryMessageRepository();
        messageRepository.update = jest.fn();

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

    test("should read a message with an user successfully", async () => {
        const command = new MessageHasBeenReadCommand(messageRepository);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();
        const firstMessageRecipient = allMessages[0].recipient;

        const request = {
            messageId: firstMessageId,
            userId: firstMessageRecipient,
        };
        
        expect(allMessages[0].status).toBe("SENT");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(messageRepository.update).toHaveBeenCalled();
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].status).toBe("READ");
        expect(allMessages[1].status).toBe("SENT");
    });

    test("should return error if there are no messages", async () => {
        const command = new MessageHasBeenReadCommand(messageRepository);

        const request = {
            messageId: "123",
            userId: "sender123",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Message not found");
    });

    test("should return error if user id is not the recipient of the message", async () => {
        const command = new MessageHasBeenReadCommand(messageRepository);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request = {
            messageId: firstMessageId,
            userId: "recipient124",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(ValidationError);
        expect(result.getErrorMessage()).toBe("User is not the recipient of the message.");
    });

    test("should return error if message has already been read", async () => {
        const command = new MessageHasBeenReadCommand(messageRepository);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request = {
            messageId: firstMessageId,
            userId: firstMessageId,
        };

        await command.run(request);

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(ValidationError);
        expect(result.getErrorMessage()).toBe("User is not the recipient of the message.");
    });
});

describe("RetrieveMessagesWithUserCommand", () => {
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

    test("should retrieves messages with an user successfully", async () => {
        const command = new RetrieveMessagesWithUserCommand(messageRepository);
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
        
        const messages = await messageRepository.findAll();
        expect(messages[0].status).toBe("SENT");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(messages).toHaveLength(2);
    });

    test("should return error if there are no messages", async () => {
        const command = new RetrieveMessagesWithUserCommand(messageRepository);

        const request = {
            userId: "sender123",
            targetUserId: "recipient123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("No messages found");
    });
});

describe("RetrieveMessagesWithUserPaginatedCommand", () => {
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

    test("should retrieve messages with a user successfully", async () => {
        const command = new RetrieveMessagesWithUserPaginatedCommand(messageRepository);
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

        const request: RetrieveMessagesWithUserPaginatedDTO = {
            userId: "sender123",
            targetUserId: "recipient123",
            after: 0,
            limit: 50
        };

        const allMessages = await messageRepository.findAll();
        expect(allMessages[0].status).toBe("SENT");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].content).toBe("hii, how are you?");
        expect(allMessages[1].content).toBe("fine, and u?");
    });

    test("should return error if there are no messages", async () => {
        const command = new RetrieveMessagesWithUserPaginatedCommand(messageRepository);

        const request: RetrieveMessagesWithUserPaginatedDTO = {
            userId: "sender123",
            targetUserId: "recipient123",
            after: 0,
            limit: 50
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("No messages found");
    });
});

describe("RetrieveUserLastMessagesCommand", () => {
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

    test("should retrieve last messages with a user successfully", async () => {
        const command = new RetrieveUserLastMessagesCommand(messageRepository);
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
            userId: "sender123"
        };

        const allMessages = await messageRepository.findAll();
        expect(allMessages[0].status).toBe("SENT");

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].content).toBe("hii, how are you?");
        expect(allMessages[1].content).toBe("fine, and u?");
    });

    test("should return error if there are no messages", async () => {
        const command = new RetrieveUserLastMessagesCommand(messageRepository);

        const request = {
            userId: "sender123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("No messages found");
    });
});

describe("UpdateMessageCommand", () => {
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

    test("should update a message successfully", async () => {
        const command = new UpdateMessageCommand(messageRepository, eventBusMock, fileHandlerMock);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request: UpdateMessageDTO = {
            userId: "sender123",
            messageId: firstMessageId,
            content: "hii, what is ur name?"
            // attachment: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(allMessages).toHaveLength(2);
        expect(allMessages[0].content).toBe("hii, what is ur name?");
        expect(allMessages[0].status).toBe("EDITED");
    });

    test("should return error if there are no messages", async () => {
        const command = new UpdateMessageCommand(messageRepository, eventBusMock, fileHandlerMock);

        const request: UpdateMessageDTO = {
            userId: "sender123",
            messageId: "123",
            content: "hii, what is ur name?"
            // attachment: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Message not found");
    });

    test("should return error if user is not the sender of the message", async () => {
        const command = new UpdateMessageCommand(messageRepository, eventBusMock, fileHandlerMock);
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

        const allMessages = await messageRepository.findAll();
        const firstMessageId = allMessages[0].getId().toString();

        const request: UpdateMessageDTO = {
            userId: "sender124",
            messageId: firstMessageId,
            content: "hii, what is ur name?"
            // attachment: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(ValidationError);
        expect(result.getErrorMessage()).toBe("User is not the sender of the message");
    });
});