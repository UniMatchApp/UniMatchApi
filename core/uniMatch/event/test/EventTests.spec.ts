import { CreateNewEventCommand } from "../application/commands/CreateNewEventCommand";
import { DeleteEventCommand } from "../application/commands/DeleteEventCommand";
import { DislikeEventCommand } from "../application/commands/DislikeEventCommand";
import { LikeEventCommand } from "../application/commands/LikeEventCommand";
import { EditEventCommand } from "../application/commands/EditEventCommand";
import { ParticipateEventCommand } from "../application/commands/ParticipateEventCommand";
import { RemoveParticipationCommand } from "../application/commands/RemoveParticipationCommand";
import { IEventRepository } from "../application/ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { CreateNewEventDTO } from "../application/DTO/CreateNewEventDTO";
import { FileError } from "@/core/shared/exceptions/FileError";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { EditEventDTO } from "../application/DTO/EditEventDTO";

describe("CreateNewEventCommand", () => {

    let repositoryMock: IEventRepository;
    let fileHandlerMock: IFileHandler;
    let eventBusMock: IEventBus;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn()
        };
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });
    

    test("should create an event correctly", async () => {
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/attachment.jpg");

        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento de prueba",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.create).toHaveBeenCalled();
        expect(fileHandlerMock.save).toHaveBeenCalledWith("attachment.jpg", request.attachment);
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should not call repository and event bus due to a previous error with the file", async () => {
        (fileHandlerMock.save as jest.Mock).mockRejectedValue(new Error("Error al guardar el archivo"));

        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento fallido",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        await command.run(request);

        expect(repositoryMock.create).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    test("should return error if title is missing", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "", 
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Title cannot be empty");
    });


    test("should return error if date is missing", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento de prueba",
            date: null as any, 
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error); 
        expect(result.getErrorMessage()).toBe("Invalid date");
    });

    test("should return error if price is negative", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento de prueba",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: -50 
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("The price cannot be negative.");
    });

    test("should return error if location is invalid", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento de prueba",
            date: new Date(),
            latitude: 999, 
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Latitude must be between -90 and 90 degrees.");
    });

    test("should create an event without a attachment", async () => {
        (fileHandlerMock.save as jest.Mock).mockResolvedValue(null);

        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento sin attachment",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: undefined,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.create).toHaveBeenCalled();
        expect(fileHandlerMock.save).not.toHaveBeenCalled();
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should create an event with price as zero", async () => {
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/attachment.jpg");

        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento con precio cero",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 0 // precio puede ser cero
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.create).toHaveBeenCalled();
        expect(fileHandlerMock.save).toHaveBeenCalledWith("attachment.jpg", request.attachment);
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should return error if latitude is null", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento con latitud nula",
            date: new Date(),
            latitude: null as any, 
            longitude: -15.4321,
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Latitude must be between -90 and 90 degrees.");
    });

    test("should return error if longitude is null", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento con longitud nula",
            date: new Date(),
            latitude: 28.1234,
            longitude: null as any, 
            altitude: 100,
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Longitude must be between -180 and 180 degrees.");
    });

    test("should return success if altitude is null", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento con altitud nula",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: null as any, 
            ownerId: "owner123",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
    });

    test("should return error if ownerId is missing", async () => {
        const command = new CreateNewEventCommand(repositoryMock, fileHandlerMock, eventBusMock);
        const request: CreateNewEventDTO = {
            title: "Evento sin ownerId",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            ownerId: "",
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Owner ID cannot be empty");
    });
})

describe("DeleteEventCommand", () => {
    
    let repositoryMock: IEventRepository;
    let fileHandlerMock: IFileHandler;
    let eventBusMock: IEventBus;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn()
        };
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
    });
    
    test("should delete an event correctly", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            attachment: "path/to/attachment.jpg",
            delete: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "event123", userId: "owner123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.deleteById).toHaveBeenCalledWith("event123");
        expect(event.delete).toHaveBeenCalled();
        expect(fileHandlerMock.delete).toHaveBeenCalledWith("path/to/attachment.jpg");
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should not delete an event due to distinct ownerId", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            attachment: "path/to/attachment.jpg",
            delete: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "event123", userId: "owner1234" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(event.delete).not.toHaveBeenCalled();
        expect(fileHandlerMock.delete).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("You are not authorized to delete this event");
    });

    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "nonexistent_event", userId: "owner123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
        expect(repositoryMock.deleteById).not.toHaveBeenCalled();
    });

    test("should handle error from file deletion", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            attachment: "path/to/attachment.jpg",
            delete: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);
        (fileHandlerMock.delete as jest.Mock).mockRejectedValue(new Error("File deletion error"));

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "event123", userId: "owner123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("File deletion error");
        expect(repositoryMock.deleteById).not.toHaveBeenCalled();
    });
    
    test("should delete an event without attachment correctly", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            delete: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "event123", userId: "owner123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.deleteById).toHaveBeenCalledWith("event123");
        expect(event.delete).toHaveBeenCalled();
        expect(fileHandlerMock.delete).not.toHaveBeenCalled(); 
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should not delete event and return error if an exception occurs", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            attachment: "path/to/attachment.jpg",
            delete: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);
        (repositoryMock.deleteById as jest.Mock).mockRejectedValue(new Error("Database error"));

        const command = new DeleteEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request = { eventId: "event123", userId: "owner123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Database error");
        expect(event.delete).toHaveBeenCalled(); 
        expect(fileHandlerMock.delete).toHaveBeenCalledWith("path/to/attachment.jpg"); 
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });
});


describe("DislikeEventCommand", () => {

    let repositoryMock: IEventRepository;


    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
        
    });

    test("should dislike an event correctly", async () => {

        const event = {
            id: "event123",
            ownerId: "owner123",
            dislike: jest.fn()
        };

        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new DislikeEventCommand(repositoryMock);
        const request = { eventId: "event123", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(event.dislike).toHaveBeenCalledWith("user123");
        expect(repositoryMock.update).toHaveBeenCalledWith(event, "event123");
    });

    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new DislikeEventCommand(repositoryMock);
        const request = { eventId: "nonexistent_event", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
    });

    
});

describe("LikeEventCommand", () => {

    let repositoryMock: IEventRepository;


    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
    });

    test("should like an event correctly", async () => {

        const event = {
            id: "event123",
            ownerId: "owner123",
            like: jest.fn()
        };

        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new LikeEventCommand(repositoryMock);
        const request = { eventId: "event123", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(event.like).toHaveBeenCalledWith("user123");
        expect(repositoryMock.update).toHaveBeenCalledWith(event, "event123");
    });

    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new LikeEventCommand(repositoryMock);
        const request = { eventId: "nonexistent_event", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
    });

});

describe("ParticipateEventCommand", () => {
    
    let repositoryMock: IEventRepository;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
    });
    
    test("should participate in an event correctly", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            addParticipant: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new ParticipateEventCommand(repositoryMock);
        const request = { eventId: "event123", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(event.addParticipant).toHaveBeenCalledWith("user123");
        expect(repositoryMock.update).toHaveBeenCalledWith(event, "event123");
    });
    
    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new ParticipateEventCommand(repositoryMock);
        const request = { eventId: "nonexistent_event", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
    });

});

describe ("RemoveParticipationCommand", () => {
    let repositoryMock: IEventRepository;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
    });
    
    test("should remove participation from an event correctly", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            removeParticipant: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new RemoveParticipationCommand(repositoryMock);
        const request = { eventId: "event123", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(event.removeParticipant).toHaveBeenCalledWith("user123");
        expect(repositoryMock.update).toHaveBeenCalledWith(event, "event123");
    });

    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new RemoveParticipationCommand(repositoryMock);
        const request = { eventId: "nonexistent_event", userId: "user123" };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
    });
});

describe("EditEventCommand", () => {

    let repositoryMock: IEventRepository;
    let eventBusMock: IEventBus;
    let fileHandlerMock: IFileHandler;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            deleteById: jest.fn(),
            deleteAll: jest.fn(),
            existsById: jest.fn()
        };
        eventBusMock = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };
        fileHandlerMock = {
            save: jest.fn(),
            read: jest.fn(),
            delete: jest.fn()
        };
    });

    test("should edit an event correctly", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            edit: jest.fn(),
            pullDomainEvents: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);
        (fileHandlerMock.save as jest.Mock).mockResolvedValue("path/to/attachment.jpg");

        const command = new EditEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request: EditEventDTO = {
            eventId: "event123",
            ownerId: "owner123",
            title: "Evento editado",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(true);
        expect(event.edit).toHaveBeenCalledWith("Evento editado", expect.anything(), request.date, request.price, "path/to/attachment.jpg");
        expect(repositoryMock.update).toHaveBeenCalledWith(event, "event123");
        expect(eventBusMock.publish).toHaveBeenCalled();
    });

    test("should return error if event is not found", async () => {
        (repositoryMock.findById as jest.Mock).mockResolvedValue(null);

        const command = new EditEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request: EditEventDTO = {
            eventId: "nonexistent_event",
            ownerId: "owner123",
            title: "Evento editado",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Event not found");
        expect(repositoryMock.update).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    test("should return error if user is not authorized to edit the event", async () => {
        const event = {
            id: "event123",
            ownerId: "owner1234",
            edit: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new EditEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request: EditEventDTO = {
            eventId: "event123",
            ownerId: "owner123",
            title: "Evento editado",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("You are not authorized to edit this event");
        expect(repositoryMock.update).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    test("should return error if attachment name is invalid", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            edit: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);

        const command = new EditEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request: EditEventDTO = {
            eventId: "event123",
            ownerId: "owner123",
            title: "Evento editado",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            attachment: { name: "" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(FileError);
        expect(result.getErrorMessage()).toBe("attachment is not a valid file");
        expect(repositoryMock.update).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    test("should return error if an exception occurs", async () => {
        const event = {
            id: "event123",
            ownerId: "owner123",
            edit: jest.fn()
        };
        (repositoryMock.findById as jest.Mock).mockResolvedValue(event);
        (fileHandlerMock.save as jest.Mock).mockRejectedValue(new Error("Error al guardar el archivo"));

        const command = new EditEventCommand(repositoryMock, eventBusMock, fileHandlerMock);
        const request: EditEventDTO = {
            eventId: "event123",
            ownerId: "owner123",
            title: "Evento editado",
            date: new Date(),
            latitude: 28.1234,
            longitude: -15.4321,
            altitude: 100,
            attachment: { name: "attachment.jpg" } as File,
            price: 100
        };

        const result = await command.run(request);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(Error);
        expect(result.getErrorMessage()).toBe("Error al guardar el archivo");
        expect(repositoryMock.update).not.toHaveBeenCalled();
        expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

});