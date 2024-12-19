import {Message} from "@/core/uniMatch/message/domain/Message";
import {MessageDeletedStatusType} from "@/core/shared/domain/MessageReceptionStatusEnum";

export interface MessageDTO {
    messageId: string;
    content: string;
    senderId: string;
    recipientId: string;
    attachment?: string;
    receptionStatus: string;
    contentStatus: string;
    deletedStatus: string;
    createdAt: number;
    updatedAt: number;
}

export namespace MessageDTO {
    function mustShowAsDeleted(requesterId: string, message: Message): MessageDeletedStatusType {
        const {recipient, sender} = message.deletedStatus;
        if (recipient === "DELETED" && sender === "DELETED") {
            return "DELETED";
        }
        if ((message.sender === requesterId && sender === "DELETED") || (message.recipient === requesterId && recipient === "DELETED")) {
            return "DELETED";
        }
        return "NOT_DELETED";
    }

    export function fromDomain(requesterId: string, message: Message): MessageDTO {
        return {
            messageId: message.getId().toString(),
            content: message.content,
            senderId: message.sender,
            recipientId: message.recipient,
            attachment: message.attachment,
            receptionStatus: message.receptionStatus,
            contentStatus: message.contentStatus,
            deletedStatus: mustShowAsDeleted(requesterId, message),
            createdAt: message.createdAt.getTime(),
            updatedAt: message.updatedAt.getTime()
        }
    }

    export function fromDomainArray(userId: string, messages: Message[]) {
        return messages.map(message => fromDomain(userId, message));
    }
}

