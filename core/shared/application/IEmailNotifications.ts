export interface IEmailNotifications {
    sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void>;
    sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void>;
    checkEmailStatus(emailId: string): Promise<boolean>;
}
