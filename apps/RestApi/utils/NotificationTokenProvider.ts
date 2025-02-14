import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { INotificationTokenProvider } from "@/core/uniMatch/notifications/application/ports/INotificationTokenProvider";
import { IUserRepository } from "@/core/uniMatch/user/application/ports/IUserRepository";

export class NotificationTokenProvider implements INotificationTokenProvider {
    private readonly userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async getNotificationToken(userId: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(`User with id ${userId} not found`);
        }
        return user.notificationToken;
    }
}