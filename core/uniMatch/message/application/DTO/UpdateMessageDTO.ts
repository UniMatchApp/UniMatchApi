export interface UpdateMessageDTO {
    messageId: string;
    userId: string;
    content?: string;
    status?: string;
    deletedStatus?: string;
}
