import {Message} from "@/core/uniMatch/message/domain/Message";

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
    export function fromDomain(message: Message): MessageDTO {
        return {
            messageId: message.getId().toString(),
            content: message.content,
            senderId: message.sender,
            recipientId: message.recipient,
            attachment: message.attachment,
            receptionStatus: message.receptionStatus,
            contentStatus: message.contentStatus,
            deletedStatus: message.deletedStatus,
            createdAt: message.createdAt.getTime(),
            updatedAt: message.updatedAt.getTime()
        }
    }

    export function fromDomainArray(messages: Message[]) {
        return messages.map(message => fromDomain(message));
    }
}