import {Message} from "@/core/uniMatch/message/domain/Message";




export interface MessageDTO {
    messageId: string;
    content: string;
    senderId: string;
    recipientId: string;
    attachment?: string;
    status: string;
    deletedStatus: string;
    timestamp: number;
}

export namespace MessageDTO {
    export function fromDomain(message: Message): MessageDTO {
        return {
            messageId: message.getId().toString(),
            content: message.content,
            senderId: message.sender,
            recipientId: message.recipient,
            attachment: message.attachment,
            status: message.receptionStatus,
            deletedStatus: message.deletedStatus,
            timestamp: message.timestamp.getTime()
        }
    }

    export function fromDomainArray(messages: Message[]) {
        return messages.map(message => fromDomain(message));
    }
}