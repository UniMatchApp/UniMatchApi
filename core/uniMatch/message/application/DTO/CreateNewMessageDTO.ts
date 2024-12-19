export interface CreateNewMessageDTO {
    userId: string;
    content: string;
    senderId: string;
    recipientId: string;
    attachment?: File;
}
