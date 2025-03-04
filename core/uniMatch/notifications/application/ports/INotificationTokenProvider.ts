export interface INotificationTokenProvider {
    getNotificationToken(userId: string): Promise<string>;
    generateServerKey(): Promise<string | null>;
}
