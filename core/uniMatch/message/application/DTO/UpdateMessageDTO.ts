export interface UpdateMessageDTO {
    userId: string;
    messageId: string;
    content: string;
    attachment?: File;
}
