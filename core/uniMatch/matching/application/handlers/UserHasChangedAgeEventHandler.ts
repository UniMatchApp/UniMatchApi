import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";

export class UserHasChangedAgeEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        const userId = event.getAggregateId();
        const age = event.getPayload().get("age");

        if (!userId || !age) {
            throw new Error("User ID and Age is required to update a user's age.");
        }

        const user = this.repository.findByUserId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.age = Number(age);
        this.repository.save(user);
    }

    getEventId(): string {
        return "user-has-changed-age";
    }
}