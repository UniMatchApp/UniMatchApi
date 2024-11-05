import { User } from '@/core/uniMatch/user/domain/User';
import { ReportedUser } from '../domain/ReportedUser';
import { Profile } from '@/core/uniMatch/user/domain/Profile';
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IUserRepository } from '../application/ports/IUserRepository';
import { IProfileRepository } from '../application/ports/IProfileRepository';
import { Gender } from '@/core/shared/domain/Gender';
import { Location } from '@/core/shared/domain/Location';
import { SexualOrientation } from '../domain/SexualOrientation';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';

import { BlockUserCommand } from '../application/commands/BlockUserCommand';
import { ChangeEmailCommand } from '../application/commands/ChangeEmailCommand';
import { CreateNewUserCommand } from '../application/commands/CreateNewUserCommand';
import { DeleteUserCommand } from '../application/commands/DeleteUserCommand';
import { LoginUserCommand } from '../application/commands/LoginUserCommand';
import { ReportUserCommand } from '../application/commands/ReportUserCommand';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

describe("BlockUserCommand", () => {
    let repositoryMock: IUserRepository;

    beforeEach(() => {
        repositoryMock = {
            findByEmail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
    });

    test("should block a user successfully", async () => {
        const command = new BlockUserCommand(repositoryMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "email@example.com",
            "password",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const result = await command.run({ userId: "user123", blockUserId: "userToBlock123" });

        expect(result.isSuccess()).toBe(true);
        expect(user.blockedUsers).toContain("userToBlock123");
    });

    test("should return error if user is not found", async () => {
        const command = new BlockUserCommand(repositoryMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const result = await command.run({ userId: "user123", blockUserId: "userToBlock123" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
    });

    test("should return error if repository update fails", async () => {
        const command = new BlockUserCommand(repositoryMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "email@example.com",
            "password",
            [],
            true
        );
        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run({ userId: "user123", blockUserId: "userToBlock123" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeEmailCommand", () => {
    let repositoryMock: IUserRepository;
    let eventBusMock: IEventBus;

    beforeEach(() => {
        repositoryMock = {
            findByEmail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });

    test("should change email successfully", async () => {
        const command = new ChangeEmailCommand(repositoryMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "email@example.com",
            "password",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request = {
            id: "user123",
            newEmail: "newemail@example.com"
        };

        const result = await command.run({ id: "user123", newEmail: "newemail@example.com" });

        expect(result.isSuccess()).toBe(true);
        // expect(user.email).toBe("newemail@example.com");
        expect(user.email).toBe(request.newEmail);
    });

    test("should return error if user is not found", async () => {
        const command = new ChangeEmailCommand(repositoryMock, eventBusMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const result = await command.run({ id: "user123", newEmail: "newemail@example.com" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeEmailCommand(repositoryMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "email@example.com",
            "password",
            [],
            true
        );
        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run({ id: "user123", newEmail: "newemail@example.com" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});