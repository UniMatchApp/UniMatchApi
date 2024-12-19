import { User } from '@/core/uniMatch/user/domain/User';
import { Profile } from '@/core/uniMatch/user/domain/Profile';
import { SexualOrientation } from '@/core/uniMatch/user/domain/SexualOrientation';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';
import { Location } from '@/core/shared/domain/Location';
import { Gender } from '@/core/shared/domain/Gender';
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { ValidationError } from '@/core/shared/exceptions/ValidationError';
import { DuplicateError } from '@/core/shared/exceptions/DuplicateError';
import { AuthenticationError } from "@/core/shared/exceptions/AuthenticationError";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IUserRepository } from '../application/ports/IUserRepository';
import { IProfileRepository } from '../application/ports/IProfileRepository';
import { IEmailNotifications } from '@/core/shared/application/IEmailNotifications';
import { CreateNewUserDTO } from '../application/DTO/CreateNewUserDTO';
import { ReportUserDTO } from '../application/DTO/ReportUserDTO';
import { CreateNewUserCommand } from '../application/commands/CreateNewUserCommand';
import { LoginUserCommand } from '../application/commands/LoginUserCommand';
import { BlockUserCommand } from '../application/commands/BlockUserCommand';
import { ReportUserCommand } from '../application/commands/ReportUserCommand';
import { ChangeEmailCommand } from '../application/commands/ChangeEmailCommand';
import { ChangePasswordCommand } from '../application/commands/ChangePasswordCommand';
import { DeleteUserCommand } from '../application/commands/DeleteUserCommand';

describe("CreateNewProfileCommand", () => {
    let userRepositoryMock: IUserRepository;
    let eventBusMock: IEventBus;
    let emailNotificationsMock: IEmailNotifications;
    let profileRepositoryMock: IProfileRepository;

    beforeEach(() => {
        userRepositoryMock = {
            findByEmail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };

        profileRepositoryMock = {
            findByUserId: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };

        emailNotificationsMock = {
            sendEmailToOne: jest.fn(),
            sendEmailToMany: jest.fn(),
            checkEmailStatus: jest.fn(),
        };

        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });

    test("should create a new user successfully", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        // expect(result.getValue()).toBeInstanceOf(User);
        expect(userRepositoryMock.create).toHaveBeenCalledWith(expect.any(User));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should return error if user already exists", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7nuevo",
            [],
            true,
        );

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
        (profileRepositoryMock.findByUserId as jest.Mock).mockResolvedValue({});

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(ValidationError);
        expect(result.getErrorMessage()).toBe(`User with email ${request.email} already exists`);
    });

    test("should send verification email if user not exists", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const user = new User(
            request.email,
            request.password
        );

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(emailNotificationsMock.sendEmailToOne).toHaveBeenCalledWith(
            user.email,
            "¡Hola, bienvenido a UniMatch!",
            expect.stringMatching(/Habla ya con tus matches. Tu código de registre es: \d{6}/)
        );
    });

    /*
    test("should resend verification email if user exists but is not verified and has no profile", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7nuevo",
            [],
            false
        );

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
        (profileRepositoryMock.findByUserId as jest.Mock).mockResolvedValue(null);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(emailNotificationsMock.sendEmailToOne).toHaveBeenCalledWith(
            user.email,
            "Reenvío de código de verificación - UniMatch",
            `Tu código de verificación es: ${user.privateKey}`
        );
    });
    */

    test("should return error if email is invalid", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@ulpgc.",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid email format.");
    });

    test("should return error if password is empty", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must be at least 8 characters long.");
    });

    test("should return error if password is less than 8 characters", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must be at least 8 characters long.");
    });

    test("should return error if password not include numbers", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEjrds.r"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must include uppercase, lowercase, a number, and a special character.");
    });

    test("should return error if password not include uppercases", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "posj2.3r"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must include uppercase, lowercase, a number, and a special character.");
    });

    test("should return error if password not include lowercases", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "POSJ2.3R"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must include uppercase, lowercase, a number, and a special character.");
    });

    test("should return error if password not include special characters", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "Posj2a3R"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must include uppercase, lowercase, a number, and a special character.");
    });

    test("should return error if profile repository update fails", async () => {
        const command = new CreateNewUserCommand(userRepositoryMock, eventBusMock, emailNotificationsMock, profileRepositoryMock);

        const request: CreateNewUserDTO = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(new Error("Update failed"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
    });
});

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
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockResolvedValue(true);

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
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
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

describe("ReportUserCommand", () => {
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

    test("should report a user successfully", async () => {
        const command = new ReportUserCommand(repositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockResolvedValue(true);

        const request : ReportUserDTO = {
            id: "user123",
            reportedUserId: "userToReport123",
            predefinedReason: "spam",
            comment: "This is a spam account"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(user.blockedUsers).toContain("userToReport123");
        expect(user.getReportedUsers()).toContainEqual(expect.objectContaining({ userId: "userToReport123" }));
        expect(repositoryMock.update).toHaveBeenCalledWith(user, user.getId());
    });

    test("should return error if user is not found", async () => {
        const command = new ReportUserCommand(repositoryMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const request : ReportUserDTO = {
            id: "user123",
            reportedUserId: "userToReport123",
            predefinedReason: "spam",
            comment: "This is a spam account"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
    });

    test("should return error if target user is already blocked", async () => {
        const command = new ReportUserCommand(repositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            ["userToReport123"],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request: ReportUserDTO = {
            id: "user123",
            reportedUserId: "userToReport123",
            predefinedReason: "spam",
            comment: "This is a spam account"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(DuplicateError);
        expect(result.getErrorMessage()).toBe(`User with id ${request.reportedUserId} is already blocked`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ReportUserCommand(repositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : ReportUserDTO = {
            id: "user123",
            reportedUserId: "userToReport123",
            predefinedReason: "spam",
            comment: "This is a spam account"
        };

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run(request);

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
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request = {
            id: "user123",
            newEmail: "newemail@ulpgc.es"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newEmail);
        expect(user.email).toBe(request.newEmail);
        expect(repositoryMock.update).toHaveBeenCalledWith(user, user.getId());
    });

    test("should return error if email is invalid", async () => {
        const command = new ChangeEmailCommand(repositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request = {
            id: "user123",
            newEmail: "newemail@ulpgc."
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid email format.");
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
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request = {
            id: "user123",
            newEmail: "newemail@ulpgc.es"
        };

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangePasswordCommand", () => {
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
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request = {
            id: "user123",
            newPassword: "poEj2.3r7@"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(undefined);
        expect(user.password).toBe(request.newPassword);
        expect(repositoryMock.update).toHaveBeenCalledWith(user, user.getId());
    });

    test("should return error if password is invalid", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);

        const request = {
            id: "user123",
            newPassword: "aska@22poe"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Password must include uppercase, lowercase, a number, and a special character.");
    });

    test("should return error if user is not found", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const result = await command.run({ id: "user123", newPassword: "poEj2.3r7@" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request = {
            id: "user123",
            newPassword: "poEj2.3r7@"
        };

        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("LoginUserCommand", () => {
    let repositoryMock: IUserRepository;
    let emailRepositoryMock: IEmailNotifications;

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
        emailRepositoryMock = {
            sendEmailToOne: jest.fn(),
            sendEmailToMany: jest.fn(),
            checkEmailStatus: jest.fn(),
        };
    });

    test("should login user successfully", async () => {
        const command = new LoginUserCommand(repositoryMock, emailRepositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const request = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        // expect(result.getValue()).toBe(user);
    });

    test("should return error if user is not found", async () => {
        const command = new LoginUserCommand(repositoryMock, emailRepositoryMock);

        (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);

        const request = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(AuthenticationError);
        expect(result.getErrorMessage()).toBe(`User with email ${request.email} not found`);
    });

    test("should return error if password is invalid", async () => {
        const command = new LoginUserCommand(repositoryMock, emailRepositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const request = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "wrongpassword"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(AuthenticationError);
        expect(result.getErrorMessage()).toBe(`Invalid password for email ${request.email}`);
    });

    test("should return error if password is empty", async () => {
        const command = new LoginUserCommand(repositoryMock, emailRepositoryMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const request = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(AuthenticationError);
        expect(result.getErrorMessage()).toBe(`Password is required`);
    });

    test("should return error if repository fails", async () => {
        const command = new LoginUserCommand(repositoryMock, emailRepositoryMock);

        (repositoryMock.findByEmail as jest.Mock).mockRejectedValue(new Error("Repository error"));

        const request = {
            email: "eduardo.ortega104@alu.ulpgc.es",
            password: "poEj2.3r7"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Repository error");
    });
});

describe("DeleteUserCommand", () => {
    let userRepositoryMock: IUserRepository;
    let profileRepositoryMock: IProfileRepository;
    let eventBusMock: IEventBus;

    beforeEach(() => {
        userRepositoryMock = {
            findByEmail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };

        profileRepositoryMock = {
            findByUserId: jest.fn(),
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

    test("should delete user successfully", async () => {
        const command = new DeleteUserCommand(userRepositoryMock, profileRepositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const profile = new Profile(
            "profile123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"],
            new Location(40.7128, -74.0060, 10)
        );

        
        (userRepositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (profileRepositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            userId: user.getId()
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(userRepositoryMock.deleteById).toHaveBeenCalledWith(request.userId);
        expect(profileRepositoryMock.findById).not.toContain(profile.getId());
    });

    test("should return error if user is not found", async () => {
        const command = new DeleteUserCommand(userRepositoryMock, profileRepositoryMock, eventBusMock);

        const request = {
            userId: "userToDelete123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`User with id ${request.userId} not found`);
    });

    test("should return error if repository delete fails", async () => {
        const command = new DeleteUserCommand(userRepositoryMock, profileRepositoryMock, eventBusMock);

        const user = new User(
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        (userRepositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (userRepositoryMock.deleteById as jest.Mock).mockRejectedValue(new Error("Delete failed"));

        const request = {
            userId: "user123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Delete failed");
    });
});