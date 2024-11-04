import { User } from '@/core/uniMatch/user/domain/User';
import { ReportedUser } from '../domain/ReportedUser';
import { Profile } from '@/core/uniMatch/user/domain/Profile';
import { DomainError } from '@/core/shared/exceptions/DomainError';
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { IUserRepository } from '../application/ports/IUserRepository';
import { IProfileRepository } from '../application/ports/IProfileRepository';
import { Gender } from '@/core/shared/domain/Gender';
import { Location } from '@/core/shared/domain/Location';
import { SexualOrientation } from '../domain/SexualOrientation';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';

import { BlockUserCommand } from '../application/commands/BlockUserCommand';
import { ChangeAboutMeCommand } from '../application/commands/ChangeAboutMeCommand';
import { ChangeDegreeCommand } from '../application/commands/ChangeDegreeCommand';
import { ChangeDrinksCommand } from '../application/commands/ChangeDrinksCommand';
import { ChangeEmailCommand } from '../application/commands/ChangeEmailCommand';
import { ChangeHeightCommand } from '../application/commands/ChangeHeightCommand';
import { ChangeHoroscopeCommand } from '../application/commands/ChangeHoroscopeCommand';
import { ChangeInterestsCommand } from '../application/commands/ChangeInterestsCommand';
import { ChangeJobCommand } from '../application/commands/ChangeJobCommand';
import { ChangePasswordCommand } from '../application/commands/ChangePasswordCommand';
import { ChangePersonalityCommand } from '../application/commands/ChangePersonalityCommand';
import { ChangePetsCommand } from '../application/commands/ChangePetsCommand';
import { ChangeRelationshipTypeCommand } from '../application/commands/ChangeRelationshipTypeCommand';
import { ChangeSexualOrientationCommand } from '../application/commands/ChangeSexualOrientationCommand';
import { ChangeSmokesCommand } from '../application/commands/ChangeSmokesCommand';
import { ChangeSportsCommand } from '../application/commands/ChangeSportsCommand';
import { ChangeValuesAndBeliefsCommand } from '../application/commands/ChangeValuesAndBeliefsCommand';
import { ChangeWeightCommand } from '../application/commands/ChangeWeightCommand';
import { CreateNewProfileCommand } from '../application/commands/CreateNewProfileCommand';
import { CreateNewUserCommand } from '../application/commands/CreateNewUserCommand';
import { DeleteUserCommand } from '../application/commands/DeleteUserCommand';
import { DeletePhotoFromTheWallCommand } from '../application/commands/DeletePhotoFromTheWallCommand';
import { GetProfileCommand } from '../application/commands/GetProfileCommand';
import { LoginUserCommand } from '../application/commands/LoginUserCommand';
import { ReportUserCommand } from '../application/commands/ReportUserCommand';
import { UploadPhotoCommand } from '../application/commands/UploadPhotoCommand';

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

describe("ChangeAboutMeCommand", () => {
    let repositoryMock: IProfileRepository;

    beforeEach(() => {
        repositoryMock = {
            findByUserId: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
    });

    test("should change about me content successfully", async () => {
        const command = new ChangeAboutMeCommand(repositoryMock);
        
        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            id: "profile123",
            newContent: "This is the new about me content"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.aboutMe).toBe(request.newContent);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeAboutMeCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "This is the new about me content"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeAboutMeCommand(repositoryMock);
        
        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const request = {
            id: "profile123",
            newContent: "This is the new about me content"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeDegreeCommand", () => {
    let repositoryMock: IProfileRepository;

    beforeEach(() => {
        repositoryMock = {
            findByUserId: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
    });

    test("should change degree successfully", async () => {
        const command = new ChangeDegreeCommand(repositoryMock);
        
        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            id: "profile123",
            degree: "New Degree"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.degree);
        expect(profile.education).toBe(request.degree);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeDegreeCommand(repositoryMock);

        const request = {
            id: "profile123",
            degree: "New Degree"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeDegreeCommand(repositoryMock);

        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const request = {
            id: "profile123",
            degree: "New Degree"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeDrinksCommand", () => {
    let repositoryMock: IProfileRepository;

    beforeEach(() => {
        repositoryMock = {
            findByUserId: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
    });

    test("should change drinks successfully", async () => {
        const command = new ChangeDrinksCommand(repositoryMock);
        
        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            id: "profile123",
            newContent: "Occasionally"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.drinks?.toLowerCase()).toBe(request.newContent.toLowerCase());
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeDrinksCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Occasionally"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeDrinksCommand(repositoryMock);

        const profile = new Profile(
            "user123",
            "John Doe",
            30,
            "This is the about me section.",
            new Gender("MALE"),
            new Location(40.7128, -74.0060, 10),
            new SexualOrientation("HETEROSEXUAL"),
            new RelationshipType("FRIENDSHIP"),
            new Date("1993-01-01"),
            ["Reading", "Traveling"],
            ["photo1.jpg", "photo2.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const request = {
            id: "profile123",
            newContent: "Occasionally"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});