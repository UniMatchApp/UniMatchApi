export interface CreateNewMessageDTO {
    content: string;
    sender: string;
    recipient: string;
    attachment?: File;
}
