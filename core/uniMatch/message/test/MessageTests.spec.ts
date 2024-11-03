import { Message } from '@/core/uniMatch/message/domain/Message';
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { MessageStatusEnum } from '@/core/shared/domain/MessageStatusEnum';
import { IMessageRepository } from '../application/ports/IMessageRepository';

describe('Message', () => {
    let messageRepository: IMessageRepository;
    let message: Message;

    beforeEach(() => {
        message = new Message(        
            "Hello, how are you?",
            "senderUser123",
            "receiverUser123",
            "image.png"
        );

        messageRepository = {
            findMessagesWithUser: jest.fn(),
            findLastMessagesOfUser: jest.fn()
        } as unknown as IMessageRepository;
    });

    it('should create a message with valid data', () => {
        expect(message.content).toBe('Hello, how are you?');
        expect(message.sender).toBe('senderUser123');
        expect(message.recipient).toBe('receiverUser123');
        expect(message.attachment).toBe('image.png');
        expect(message.status).toBe(MessageStatusEnum.SENT);
        expect(message.deletedStatus).toBe(MessageStatusEnum.NOT_DELETED);
    });

    it('should delete a message by a sender', () => {
        message.deleteBySender();
        expect(message.deletedStatus).toBe(MessageStatusEnum.DELETED_BY_SENDER);
        expect(message.getIsActive()).toBe(false);
    });

    it('should delete a message by a recipient', () => {
        message.deleteByRecipient();
        expect(message.deletedStatus).toBe(MessageStatusEnum.DELETED_BY_RECIPIENT);
        expect(message.getIsActive()).toBe(false);
    });

    it('should delete a message for both sender and recipient', () => {
        message.deleteForBoth();
        expect(message.deletedStatus).toBe(MessageStatusEnum.DELETED_FOR_BOTH);
        expect(message.getIsActive()).toBe(false);
    });

    it('should edit a message content and update timestamp', () => {
        const originalTimestamp = message.timestamp;
        const newContent = "Updated message content";
        message.edit(newContent, "updatedImage.png");
        
        expect(message.content).toBe(newContent);
        expect(message.attachment).toBe("updatedImage.png");
        expect(message.timestamp.getTime()).toBeGreaterThanOrEqual(originalTimestamp.getTime());
    });

    it('should not allow setting empty content', () => {
        expect(() => {
            message.edit("");
        }).toThrow(DomainError);
    });

    it('should send a new message and record event', () => {
        const eventSpy = jest.spyOn(message, 'recordEvent');
        message.send();
        
        expect(eventSpy).toHaveBeenCalled();
    });

    it('should record event when message is edited', () => {
        const eventSpy = jest.spyOn(message, 'recordEvent');
        message.edit("New content");

        expect(eventSpy).toHaveBeenCalled();
    });

    it('should retrieve all messages with a specific user', async () => {
        const expectedMessages = [
            new Message('Hello', "senderId", "recipientId"),
            new Message('How are you?', "senderId", "recipientId"),
        ];
        (messageRepository.findLastMessagesOfUser as jest.Mock).mockResolvedValue(expectedMessages);
    
        const result = await messageRepository.findLastMessagesOfUser("senderUser123");

        expect(messageRepository.findLastMessagesOfUser).toHaveBeenCalledWith(message.sender);
        expect(result).toEqual(expectedMessages);
    });
});