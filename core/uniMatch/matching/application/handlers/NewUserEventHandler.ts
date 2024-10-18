import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Node } from "../../domain/Node";

export class NewUserEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        const user = event.getPayload().get("user");

        if (!user) {
            throw new Error("User is required to create a new user.");
        }

        //TODO: Create a new node with the user data
    }

    getEventId(): string {
        return "new-user-created";
    }
}
