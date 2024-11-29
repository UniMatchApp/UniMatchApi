import { CreateNewProfileCommand } from '@/core/uniMatch/user/application/commands/CreateNewProfileCommand';
import { IUserRepository } from '@/core/uniMatch/user/application/ports/IUserRepository';
import { IEventBus } from '@/core/shared/application/IEventBus';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';
import { IProfileRepository } from '@/core/uniMatch/user/application/ports/IProfileRepository';
import { TypeORMUserRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository';
import { TypeORMProfileRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMProfileRepository';
import { EmailNotifications } from '@/core/shared/infrastructure/notifications/EmailNotifications';
import { InMemoryEventBus } from '@/core/shared/infrastructure/eventBus/InMemoryEventBus';
import AppDataSource from '@/core/uniMatch/user/infrastructure/TypeORM/Config';

import { CreateNewProfileDTO } from '@/core/uniMatch/user/application/DTO/CreateNewProfileDTO';


export async function createMoreProfiles() {
    await AppDataSource.initialize();

    const userRepository: IUserRepository = new TypeORMUserRepository();
    const profileRepository: IProfileRepository = new TypeORMProfileRepository();
    const emailNotifications: IEmailNotifications = new EmailNotifications();
    const eventBus: IEventBus = new InMemoryEventBus();

    const command = new CreateNewProfileCommand(userRepository, eventBus, emailNotifications, profileRepository);

    const users = await userRepository.findAll();

    const excludedEmails = ['user1@alu.ulpgc.es', 'user2@alu.ulpgc.es', 'user3@alu.ulpgc.es'];

    for (const user of users) {
        if (excludedEmails.includes(user.email)) {
            console.log(`Skipping profile creation for user ${user.email}.`);
            continue;
        }

        const request: CreateNewProfileDTO = {
            userId: user.getId().toString(),
            name: `User ${user.getId()}`,
            age: 25,
            aboutMe: `I'm profile ${user.getId()}`,
            location: { latitude: 28.1234, longitude: -15.4321 },
            gender: "Male",
            sexualOrientation: "Heterosexual",
            relationshipType: "Single",
            birthday: new Date('1996-01-01'),
            attachment: null
        };

        const result = await command.run(request);

        if (result.isSuccess()) {
            console.log(`Profile for user ${user.getId()} created successfully.`);
        } else {
            console.error(`Failed to create profile for user ${user.getId()}:`, result.getErrorMessage());
        }
    }

    await AppDataSource.destroy();
}

createMoreProfiles().catch(console.error);