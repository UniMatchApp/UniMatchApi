import { UserIsOnlineCommand } from "../application/commands/UserIsOnlineCommand";
import { ISessionStatusRepository } from "../application/ports/ISessionStatusRepository";
import { SessionStatus } from "../domain/SessionStatus";


describe("UserIsOnlineCommand", () => {
    let repositoryMock: ISessionStatusRepository;
    let command: UserIsOnlineCommand;

    beforeEach(() => {
        repositoryMock = {
            create: jest.fn()
        } as unknown as ISessionStatusRepository;

        command = new UserIsOnlineCommand(repositoryMock);
    });

    // TODO: Comprobar que el usuario existe, no se hace
    test("should set user status to online successfully", async () => {
        const request = { userId: "user123" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.create).toHaveBeenCalledWith(expect.any(SessionStatus));
    });

    test("should handle errors during the creation of user status", async () => {
        const request = { userId: "user123" };
        (repositoryMock.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toEqual(new Error("Database error"));
    });

    test("should handle unexpected errors", async () => {
        const request = { userId: "user123" };
        (repositoryMock.create as jest.Mock).mockRejectedValueOnce(new Error("Unexpected error"));

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toEqual(new Error("Unexpected error"));
    });
});
