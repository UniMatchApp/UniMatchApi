import { CreateNewMessageCommand } from '@/core/uniMatch/message/application/commands/CreateNewMessageCommand';
import { IMessageRepository } from '@/core/uniMatch/message/application/ports/IMessageRepository';
import { IEventBus } from '@/core/shared/application/IEventBus';
import { CreateNewMessageDTO } from '@/core/uniMatch/message/application/DTO/CreateNewMessageDTO';
import { TypeORMMessageRepository } from '@/core/uniMatch/message/infrastructure/TypeORM/repositories/TypeORMMessageRepository';
import { InMemoryEventBus } from '@/core/shared/infrastructure/eventBus/InMemoryEventBus';
import AppDataSource from '@/core/uniMatch/message/infrastructure/TypeORM/Config';
import { FileHandler } from '@/core/shared/infrastructure/fileHandler/FileHandler';

import { IUserRepository } from '@/core/uniMatch/user/application/ports/IUserRepository';
import { TypeORMUserRepository } from '@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository';

export async function createMoreMessages() {
    await AppDataSource.initialize();

    const userRepository: IUserRepository = new TypeORMUserRepository();

    // Recuperar todos los usuarios
    const users = await userRepository.findAll();
    const userIds = users.map(user => user.getId().toString());

    const messageRepository: IMessageRepository = new TypeORMMessageRepository();
    const eventBus: IEventBus = new InMemoryEventBus();
    const fileHandler: FileHandler = new FileHandler('http://localhost', '8080');

    const command = new CreateNewMessageCommand(messageRepository, eventBus, fileHandler);

    for (let i = 1; i <= 200; i++) {
        const senderId = userIds[i % userIds.length];
        const recipientId = userIds[(i + 1) % userIds.length];

        const request: CreateNewMessageDTO = {
            senderId: senderId,
            recipientId: recipientId,
            content: `This is message ${i}`
        };

        const result = await command.run(request);

        if (result.isSuccess()) {
            console.log(`Message ${i} created successfully.`);
        } else {
            console.error(`Failed to create message ${i}:`, result.getErrorMessage());
        }
    }

    await AppDataSource.destroy();
}

createMoreMessages().catch(console.error);