import { CreateNewUserCommand } from '@/core/uniMatch/user/application/commands/CreateNewUserCommand';
import { IUserRepository } from '@/core/uniMatch/user/application/ports/IUserRepository';
import { IEventBus } from '@/core/shared/application/IEventBus';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';
import { IProfileRepository } from '@/core/uniMatch/user/application/ports/IProfileRepository';
import { CreateNewUserDTO } from '@/core/uniMatch/user/application/DTO/CreateNewUserDTO';
import { TypeORMUserRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository';
import { TypeORMProfileRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMProfileRepository';
import { EmailNotifications } from '@/core/shared/infrastructure/notifications/EmailNotifications';
import { InMemoryEventBus } from '@/core/shared/infrastructure/eventBus/InMemoryEventBus';
import AppDataSource from '@/core/uniMatch/user/infrastructure/TypeORM/Config';

export async function createMoreUsers() {
    await AppDataSource.initialize();

    const userRepository: IUserRepository = new TypeORMUserRepository();
    const profileRepository: IProfileRepository = new TypeORMProfileRepository();
    const emailNotifications: IEmailNotifications = new EmailNotifications();
    const eventBus: IEventBus = new InMemoryEventBus();

    const command = new CreateNewUserCommand(userRepository, eventBus, emailNotifications, profileRepository);

    for (let i = 5; i <= 200; i++) {
        const request: CreateNewUserDTO = {
            email: `user${i}@alu.ulpgc.es`,
            password: `Password24?`
        };

        const result = await command.run(request);

        if (result.isSuccess()) {
            console.log(`User ${i} created successfully.`);
        } else {
            console.error(`Failed to create user ${i}:`, result.getErrorMessage());
        }
    }

    await AppDataSource.destroy();
}

createMoreUsers().catch(console.error);