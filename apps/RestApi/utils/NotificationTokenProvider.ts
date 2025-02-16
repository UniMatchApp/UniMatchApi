import { google } from 'googleapis';
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { INotificationTokenProvider } from "@/core/uniMatch/notifications/application/ports/INotificationTokenProvider";
import { IUserRepository } from "@/core/uniMatch/user/application/ports/IUserRepository";
import * as path from 'path';

// Ruta al archivo de credenciales de la cuenta de servicio
const keyFilePath = path.resolve(__dirname, 'firebase.json');

export class NotificationTokenProvider implements INotificationTokenProvider {
    private readonly userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async generateServerKey(): Promise<string | null> {
        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        });

        try {
            const accessToken = await auth.getAccessToken();
            return accessToken || null;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw new Error('Failed to generate server key');
        }
    }

    public async getNotificationToken(userId: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }

        return user.notificationToken;
    }
}
