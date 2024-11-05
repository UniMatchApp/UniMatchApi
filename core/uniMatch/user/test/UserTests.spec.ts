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
            "profile123",
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
            "profile123",
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
            "profile123",
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
            "profile123",
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
            "profile123",
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
            "profile123",
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

describe("ChangeHeightCommand", () => {
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

    test("should change height successfully", async () => {
        const command = new ChangeHeightCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newHeight: 230
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newHeight.toString());
        expect(profile.height).toBe(request.newHeight);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeHeightCommand(repositoryMock);

        const request = {
            id: "profile123",
            newHeight: 230
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeHeightCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newHeight: 230
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeHoroscopeCommand", () => {
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

    test("should change horoscope successfully", async () => {
        const command = new ChangeHoroscopeCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newContent: "TAURUS"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.horoscope?.value).toBe(request.newContent);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });
    
    test("should return error if profile is not found", async () => {
        const command = new ChangeHoroscopeCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Tauro"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeHoroscopeCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newContent: "Tauro"
        };
        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeInterestsCommand", () => {
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

    test("should change interests successfully", async () => {
        const command = new ChangeInterestsCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newInterests: ["Football", "Basketball"]
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newInterests);
        expect(profile.interests).toEqual(request.newInterests);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeInterestsCommand(repositoryMock);

        const request = {
            id: "profile123",
            newInterests: ["Football", "Basketball"]
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeInterestsCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newInterests: ["Football", "Basketball"]
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeJobCommand", () => {
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

    test("should change job successfully", async () => {
        const command = new ChangeJobCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newContent: "Football Player"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.job).toEqual(request.newContent);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeJobCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Football Player"
        };


        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeJobCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newContent: "Football Player"
        };

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

    /*
    test("should change password successfully", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);
        
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
            newPassword: "newpassword"
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);

        expect(user.password).toBe(request.newPassword);

        expect(repositoryMock.update).toHaveBeenCalledWith(user, user.getId());
    });

    test("should return error if user is not found", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const result = await command.run({ id: "user123", newPassword: "newpassword" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangePasswordCommand(repositoryMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "email@example.com",
            "password",
            [],
            true
        );
        (repositoryMock.findById as jest.Mock).mockResolvedValue(user);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run({ id: "user123", newPassword: "newpassword" });

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
    */
});

describe("ChangePersonalityCommand", () => {
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

    test("should change personality successfully", async () => {
        const command = new ChangePersonalityCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newContent: "I'm very sociable"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.personalityType).toEqual(request.newContent);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangePersonalityCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "I'm very sociable"
        };


        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangePersonalityCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newContent: "I'm very sociable"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangePetsCommand", () => {
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

    test("should change pets status successfully", async () => {
        const command = new ChangePetsCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newContent: "Yes, dogs and cats"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.pets).toEqual(request.newContent);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangePetsCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Yes, dogs and cats"
        };


        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangePetsCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newContent: "Yes, dogs and cats"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeRelationshipTypeCommand", () => {
    let repositoryMock: IProfileRepository;
    let eventBusMock: IEventBus;   

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
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });

    test("should change relationship type successfully", async () => {
        const command = new ChangeRelationshipTypeCommand(repositoryMock, eventBusMock);
        
        const profile = new Profile(
            "profile123",
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
            relationshipType: "CASUAL"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.relationshipType);
        expect(profile.relationshipType.value).toEqual(request.relationshipType);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeRelationshipTypeCommand(repositoryMock, eventBusMock);

        const request = {
            id: "profile123",
            relationshipType: "CASUAL"
        };


        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeRelationshipTypeCommand(repositoryMock, eventBusMock);

        const profile = new Profile(
            "profile123",
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
            relationshipType: "CASUAL"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeSexualOrientationCommand", () => {
    let repositoryMock: IProfileRepository;
    let eventBusMock: IEventBus;

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
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });

    test("should change sexual orientation successfully", async () => {
        const command = new ChangeSexualOrientationCommand(repositoryMock, eventBusMock);
        
        const profile = new Profile(
            "profile123",
            "Antonio Aparicio",
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
            newSexualOrientation: "HOMOSEXUAL"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newSexualOrientation);
        expect(profile.sexualOrientation.value).toEqual(request.newSexualOrientation);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeSexualOrientationCommand(repositoryMock, eventBusMock);

        const request = {
            id: "profile123",
            newSexualOrientation: "HOMOSEXUAL"
        };


        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeSexualOrientationCommand(repositoryMock, eventBusMock);

        const profile = new Profile(
            "profile123",
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
            newSexualOrientation: "HOMOSEXUAL"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("ChangeSmokesCommand", () => {
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

    test("should change smokes status successfully", async () => {
        const command = new ChangeSmokesCommand(repositoryMock);
        
        const profile = new Profile(
            "profile123",
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
            newContent: "Occasionally",
        };
    
        const result = await command.run(request);
    
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.smokes).toEqual(request.newContent.toUpperCase());
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeSmokesCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Occasionally",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        // todo: expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeSmokesCommand(repositoryMock);

        const profile = new Profile(
            "profile123",
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
            newContent: "Occasionally",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("CreateNewProfileCommand", () => {
    let userRepositoryMock: IUserRepository;
    let profileRepositoryMock: IProfileRepository;
    let fileHandlerMock: IFileHandler;
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

        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn(),
        };

        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });

    test("should create a new profile successfully", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);
        
        const request = {
            userId: "user123",
            name: "John Doe",
            age: 30,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: [],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        const profileUrl = await fileHandlerMock.save(UUID.generate().toString(), request.image);

        const profile = new Profile(
            request.userId,
            request.name,
            request.age,
            request.aboutMe,
            Gender.fromString(request.gender),
            new Location(request.location.latitude, request.location.longitude),
            new SexualOrientation(request.sexualOrientation),
            RelationshipType.fromString(request.relationshipType),
            request.birthday,
            request.interests,
            [profileUrl]
        );
        profile.preferredImage = profileUrl;

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeInstanceOf(Profile);
        expect(profileRepositoryMock.create).toHaveBeenCalledWith(expect.any(Profile));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });
});