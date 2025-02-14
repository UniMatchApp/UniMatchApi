export interface INotificationTokenProvider {
    getNotificationToken(userId: string): Promise<string>;
}
