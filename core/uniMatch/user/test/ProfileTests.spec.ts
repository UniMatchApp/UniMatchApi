import { Profile } from '@/core/uniMatch/user/domain/Profile';
import { User } from '@/core/uniMatch/user/domain/User';
import { NotFoundError } from '@/core/shared/exceptions/NotFoundError';
import { FileError } from '@/core/shared/exceptions/FileError';
import { NullPointerError } from "@/core/shared/exceptions/NullPointerError";
import { IUserRepository } from '../application/ports/IUserRepository';
import { IProfileRepository } from '../application/ports/IProfileRepository';
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Gender } from '@/core/shared/domain/Gender';
import { Location } from '@/core/shared/domain/Location';
import { SexualOrientation } from '../domain/SexualOrientation';
import { RelationshipType } from '@/core/shared/domain/RelationshipType';
import { CreateNewProfileCommand } from '../application/commands/CreateNewProfileCommand';
import { ChangeAboutMeCommand } from '../application/commands/ChangeAboutMeCommand';
import { ChangeDegreeCommand } from '../application/commands/ChangeDegreeCommand';
import { ChangeDrinksCommand } from '../application/commands/ChangeDrinksCommand';
import { ChangeHeightCommand } from '../application/commands/ChangeHeightCommand';
import { ChangeHoroscopeCommand } from '../application/commands/ChangeHoroscopeCommand';
import { ChangeInterestsCommand } from '../application/commands/ChangeInterestsCommand';
import { ChangeJobCommand } from '../application/commands/ChangeJobCommand';
import { ChangePersonalityCommand } from '../application/commands/ChangePersonalityCommand';
import { ChangePetsCommand } from '../application/commands/ChangePetsCommand';
import { ChangeRelationshipTypeCommand } from '../application/commands/ChangeRelationshipTypeCommand';
import { ChangeSexualOrientationCommand } from '../application/commands/ChangeSexualOrientationCommand';
import { ChangeSportsCommand } from '../application/commands/ChangeSportsCommand';
import { ChangeValuesAndBeliefsCommand } from '../application/commands/ChangeValuesAndBeliefsCommand';
import { ChangeWeightCommand } from '../application/commands/ChangeWeightCommand';
import { ChangeSmokesCommand } from '../application/commands/ChangeSmokesCommand';
import { DeletePhotoFromTheWallCommand } from '../application/commands/DeletePhotoFromTheWallCommand';
import { GetProfileCommand } from '../application/commands/GetProfileCommand';
import { UploadPhotoCommand } from '../application/commands/UploadPhotoCommand';
import { CreateNewProfileDTO } from "../application/DTO/CreateNewProfileDTO";

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
        
        const user = new User(
            new Date("2023-01-01"),
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "John Doe",
            age: 30,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeInstanceOf(Profile);
        expect(profileRepositoryMock.create).toHaveBeenCalledWith(expect.any(Profile));
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should return error if user is not found", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "John Doe",
            age: 30,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`User with id ${request.userId} does not exist`);
    });

    test("should return error if profile repository update fails", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);

        const user = new User(
            new Date("2023-01-01"),
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "John Doe",
            age: 30,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
        (profileRepositoryMock.create as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });

    test("should return error if name is empty", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "",
            age: 30,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Name cannot be empty.");
    });

    test("should return error if age is under 18", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "John Doe",
            age: 17,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Age must be between 18 and 100.");
    });

    test("should return error if age is over 100", async () => {
        const command = new CreateNewProfileCommand(userRepositoryMock, profileRepositoryMock, fileHandlerMock, eventBusMock);
        
        const user = new User(
            new Date("2023-01-01"),
            "eduardo.ortega104@alu.ulpgc.es",
            "poEj2.3r7",
            [],
            true
        );

        const request : CreateNewProfileDTO = {
            userId: "profle123",
            name: "John Doe",
            age: 101,
            aboutMe: "This is the about me section.",
            gender: "MALE",
            location: { latitude: 40.7128, longitude: -74.0060 },
            sexualOrientation: "HETEROSEXUAL",
            relationshipType: "FRIENDSHIP",
            birthday: new Date("1993-01-01"),
            interests: ["Reading", "Traveling"],
            wall: ["profile.jpg", "profile1.jpg", "profile2.jpg"],
            image: new File([""], "profile.jpg", { type: "image/jpeg" })
        };

        (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Age must be between 18 and 100.");
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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

    test("should change drinks successfully if it is empty", async () => {
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
            newContent: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.drinks?.toLowerCase()).toBe(undefined);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if drinks status not valid", async () => {
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
            newContent: "Depends"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid drinks value.");
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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

    test("should change height successfully if it is empty", async () => {
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
            newHeight: undefined
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe("");
        expect(profile.height).toBe(request.newHeight);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if height is under 120", async () => {
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
            newHeight: 119
        };

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Height must be between 120 and 240 cm.");
    });

    test("should return error if height is over 240", async () => {
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
            newHeight: 241
        };

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Height must be between 120 and 240 cm.");
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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

describe("ChangeWeightCommand", () => {
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

    test("should change weight successfully", async () => {
        const command = new ChangeWeightCommand(repositoryMock);

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
            newWeight: 80
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newWeight.toString());
        expect(profile.weight).toBe(request.newWeight);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should change weight successfully if it is empty", async () => {
        const command = new ChangeWeightCommand(repositoryMock);

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
            newWeight: undefined
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe("");
        expect(profile.weight).toBe(request.newWeight);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if weight is under 30", async () => {
        const command = new ChangeWeightCommand(repositoryMock);
        
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
            newWeight: 29
        };

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Weight must be between 30 and 300 kg.");
    });

    test("should return error if weight is over 300", async () => {
        const command = new ChangeWeightCommand(repositoryMock);
        
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
            newWeight: 301
        };

        const result = await command.run(request);
        
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Weight must be between 30 and 300 kg.");
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeWeightCommand(repositoryMock);

        const request = {
            id: "profile123",
            newWeight: 80
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeWeightCommand(repositoryMock);

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
            newWeight: 80
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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

    test("should change smokes successfully if it is empty", async () => {
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
            newContent: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.smokes?.toLowerCase()).toBe(undefined);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if smokes status not valid", async () => {
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
            newContent: "Depends"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid smokes value.");
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
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
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

describe("ChangeSportsCommand", () => {
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

    test("should change sports status successfully", async () => {
        const command = new ChangeSportsCommand(repositoryMock);

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
        expect(profile.doesSports).toEqual(request.newContent.toUpperCase());
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should change sports successfully if it is empty", async () => {
        const command = new ChangeSportsCommand(repositoryMock);

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
            newContent: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.doesSports?.toLowerCase()).toBe(undefined);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if sports status not valid", async () => {
        const command = new ChangeSportsCommand(repositoryMock);

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
            newContent: "Depends"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid doesSports value.");
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeSportsCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Occasionally",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeSportsCommand(repositoryMock);

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

describe("ChangeValuesAndBeliefsCommand", () => {
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

    test("should change values and beliefs status successfully", async () => {
        const command = new ChangeValuesAndBeliefsCommand(repositoryMock);

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
            newContent: "Catholic",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.valuesAndBeliefs).toEqual(request.newContent.toUpperCase());
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should change values and beliefs successfully if it is empty", async () => {
        const command = new ChangeValuesAndBeliefsCommand(repositoryMock);

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
            newContent: ""
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.newContent);
        expect(profile.valuesAndBeliefs?.toLowerCase()).toBe(undefined);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if values and beliefs status not valid", async () => {
        const command = new ChangeValuesAndBeliefsCommand(repositoryMock);

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
            newContent: "Depends"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Invalid values and beliefs value.");
    });

    test("should return error if profile is not found", async () => {
        const command = new ChangeValuesAndBeliefsCommand(repositoryMock);

        const request = {
            id: "profile123",
            newContent: "Catholic",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new ChangeValuesAndBeliefsCommand(repositoryMock);

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
            newContent: "Catholic",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("DeletePhotoFromTheWallCommand", () => {
    let repositoryMock: IProfileRepository;
    let fileHandlerMock: IFileHandler

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
        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn(),
        };
    });

    test("should delete a photo from the wall successfully", async () => {
        const command = new DeletePhotoFromTheWallCommand(repositoryMock, fileHandlerMock);

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
            ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            id: "profile123",
            photoURL: "photo1.jpg",

        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(profile.wall).not.toContain(request.photoURL);
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should not delete a photo from the wall if not exists", async () => {
        const command = new DeletePhotoFromTheWallCommand(repositoryMock, fileHandlerMock);

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
            ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);

        const request = {
            id: "profile123",
            photoURL: "photo5.jpg",

        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Photo with URL ${request.photoURL} not found`);
        expect(profile.wall).not.toContain(request.photoURL);
        expect(repositoryMock.update).not.toHaveBeenCalled();
    });

    test("should return error if profile is not found", async () => {
        const command = new DeletePhotoFromTheWallCommand(repositoryMock, fileHandlerMock);

        const request = {
            id: "profile123",
            photoURL: "photo4.jpg",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if repository update fails", async () => {
        const command = new DeletePhotoFromTheWallCommand(repositoryMock, fileHandlerMock);

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
            ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]
        );

        (repositoryMock.findById as jest.Mock).mockResolvedValue(profile);
        (repositoryMock.update as jest.Mock).mockRejectedValue(new Error("Update failed"));

        const request = {
            id: "profile123",
            photoURL: "photo4.jpg",
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Update failed");
    });
});

describe("GetProfileCommand", () => {
    let repositoryMock: IProfileRepository;

    beforeEach(() => {
        repositoryMock = {
            findById: jest.fn(),
            update: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };
    });

    test("should get profile successfully", async () => {
        const command = new GetProfileCommand(repositoryMock);

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
            id: "profile123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(profile);
    });

    test("should return error if profile is not found", async () => {
        const command = new GetProfileCommand(repositoryMock);

        const request = {
            id: "profile123"
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });
});

describe("UploadPhotoCommand", () => {
    let repositoryMock: IProfileRepository;
    let fileHandlerMock: IFileHandler;

    beforeEach(() => {
        repositoryMock = {
            findById: jest.fn(),
            update: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            existsById: jest.fn(),
            deleteAll: jest.fn(),
        };

        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn(),
        };
    });

    test("should upload photo successfully", async () => {
        const command = new UploadPhotoCommand(repositoryMock, fileHandlerMock);

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
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/photo5.jpg");

        const request = {
            id: "profile123",
            photo: new File([""], "photo5.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBe(request.photo);
        expect(profile.wall).toContain("path/to/photo5.jpg");
        expect(repositoryMock.update).toHaveBeenCalledWith(profile, profile.getId());
    });

    test("should return error if file name is invalid", async () => {
        const command = new UploadPhotoCommand(repositoryMock, fileHandlerMock);

        const request = {
            id: "profile123",
            photo: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(FileError);
        expect(result.getErrorMessage()).toBe("Invalid file name");
    });

    test("should return error if photo URL is null", async () => {
        const command = new UploadPhotoCommand(repositoryMock, fileHandlerMock);

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
        (fileHandlerMock.save as jest.Mock).mockResolvedValue(null);

        const request = {
            id: "profile123",
            photo: new File([""], "photo.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NullPointerError);
        expect(result.getErrorMessage()).toBe("Photo url is null");
    });

    test("should return error if profile is not found", async () => {
        const command = new UploadPhotoCommand(repositoryMock, fileHandlerMock);

        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/photo5.jpg");

        const request = {
            id: "profile123",
            photo: new File([""], "photo5.jpg", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe(`Profile with id ${request.id} not found`);
    });

    test("should return error if file name is invalid", async () => {
        const command = new UploadPhotoCommand(repositoryMock, fileHandlerMock);

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
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/photo5.jpg");

        const request = {
            id: "profile123",
            photo: new File([""], "", { type: "image/jpeg" })
        };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(FileError);
        expect(result.getErrorMessage()).toBe("Invalid file name");
    });
});