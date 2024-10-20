export interface CreateNewMessageDTO {
    content: string;
    senderId: string;
    recipientId: string;
    attachment?: File;
}
