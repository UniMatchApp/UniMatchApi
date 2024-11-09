import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { UserDislikedSomebodyCommand } from "../application/commands/userDislikedSomebodyCommand";
import { UserLikedSomebodyCommand } from "../application/commands/userLikedSomebodyCommand";
import { IMatchingRepository } from "../application/ports/IMatchingRepository";
import { Dislike } from "../domain/relations/Dislike";
import { Like } from "../domain/relations/Like";

describe("UserDislikedSomebodyCommand", () => {
    let repositoryMock: IMatchingRepository;
    let command: UserDislikedSomebodyCommand;

    beforeEach(() => {
        repositoryMock = {
            findByUserId: jest.fn(),
            dislikeUser: jest.fn()
        } as unknown as IMatchingRepository;

        command = new UserDislikedSomebodyCommand(repositoryMock);
    });

    test("should successfully dislike another user", async () => {
        const user = { id: "user123" };
        const dislikedUser = { id: "user456" };

        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(dislikedUser);

        const request = { userId: "user123", dislikedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.dislikeUser).toHaveBeenCalledWith(expect.any(Dislike));
    });

    test("should fail if the user is not found", async () => {
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(null);

        const request = { userId: "user123", dislikedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("User not found");
    });

    test("should fail if the disliked user is not found", async () => {
        const user = { id: "user123" };
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(null);

        const request = { userId: "user123", dislikedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Disliked user not found");
    });

    test("should handle unexpected errors", async () => {
        const user = { id: "user123" };
        const dislikedUser = { id: "user456" };

        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(dislikedUser);
        (repositoryMock.dislikeUser as jest.Mock).mockRejectedValueOnce(new Error("Unexpected error"));

        const request = { userId: "user123", dislikedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toEqual(new Error("Unexpected error"));
    });
});

describe("UserLikedSomebodyCommand", () => {
    let repositoryMock: IMatchingRepository;
    let command: UserLikedSomebodyCommand;

    beforeEach(() => {
        repositoryMock = {
            findByUserId: jest.fn(),
            likeUser: jest.fn()
        } as unknown as IMatchingRepository;

        command = new UserLikedSomebodyCommand(repositoryMock);
    });

    test("should successfully like another user", async () => {
        const user = { id: "user123" };
        const likedUser = { id: "user456" };

        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(likedUser);

        const request = { userId: "user123", likedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(true);
        expect(repositoryMock.likeUser).toHaveBeenCalledWith(expect.any(Like));
    });

    test("should fail if the user is not found", async () => {
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(null);

        const request = { userId: "user123", likedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("User not found");
    });

    test("should fail if the liked user is not found", async () => {
        const user = { id : "user123" };
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(null);

        const request = { userId: "user123", likedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toBeInstanceOf(NotFoundError);
        expect(result.getErrorMessage()).toBe("Liked user not found");
    });

    test("should handle unexpected errors", async () => {
        const user = { id: "user123" };
        const likedUser = { id: "user456" };

        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(user);
        (repositoryMock.findByUserId as jest.Mock).mockResolvedValueOnce(likedUser);
        (repositoryMock.likeUser as jest.Mock).mockRejectedValueOnce(new Error("Unexpected error"));

        const request = { userId: "user123", likedUserId: "user456" };

        const result = await command.run(request);

        expect(result.isSuccess()).toBe(false);
        expect(result.getError()).toEqual(new Error("Unexpected error"));
    });
        
});